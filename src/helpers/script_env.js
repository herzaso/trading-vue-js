
// Script environment. Packs everything that
// needed for a script execution together:
// script src, standart functions, input data,
// other overlays & dependencies

import ScriptStd from './script_std.js'

const FDEFS = /(function |)([$A-Z_][0-9A-Z_$\.]*)[\s]*?\((.*?)\)/gmi

export default class ScriptEnv {

    constructor(s, data) {

        this.std = new ScriptStd(this)
        this.src = s
        this.output = []
        this.data = []
        this.tss = {}
        this.output.box_maker = this.make_box(s.src)
        this.output.box_maker(this, data)
        delete this.output.box_maker

    }

    // A small sandbox for a particular script
    make_box(src) {

        let proto = Object.getPrototypeOf(this.std)
        let std = ``
        for (var k of Object.getOwnPropertyNames(proto)) {
            if (k === 'constructor') continue
            std += `const ${k} = self.std.${k}.bind(self.std)\n`
        }

        let props = ``

        for (var k in src.props) {
            props += `var ${k} = ${src.props[k].def}\n`
        }
        // TODO: add argument values to _id

        return Function('self,tsdata', `
            'use strict';

            // Built-in functions (aliases)
            ${std}

            // Timeseries
            const open = tsdata.open
            const high = tsdata.high
            const low = tsdata.low
            const close = tsdata.close
            const vol = tsdata.vol

            // Direct data ts
            const data = self.data
            const ohlcv = tsdata.ohlcv

            // Script's properties (init)
            ${props}

            this.init = () => {
                ${src.init_src}
            }

            this.update = (_id = 'root') => {
                ${this.prep(src.upd_src)}
            }
        `)
    }

    // Preprocess the update function.
    // Replace functions with the full arguments list +
    // generate & add tsid
    prep(src) {

        //console.log('Before -----> \n', src)

        let h = this.src.use_for[0] // TODO: add props here
        src = '\t\t  let _pref = `${_id}<-'+h+'<-`\n' + src

        FDEFS.lastIndex = 0
        let call_id = 0 // Function call id (to make each call unique)

        do {
            var m = FDEFS.exec(src)
            if (m) {
                let fkeyword = m[1].trim()
                let fname = m[2]
                let fargs = m[3]

                if (fkeyword === 'function') {
                    // TODO: addinf _ids to inline functions
                } else {
                    if (this.std[fname]) {
                        src = this.postfix(src, m, ++call_id)
                    }
                }
            }
        } while (m)

        //console.log('After ----->\n', src)

        return src
    }

    // Postfix function calls with ts _ids
    postfix(src, m, call_id) {

        let target = this.get_args(this.fdef(m[2])).length
        let args = this.get_args(m[0])

        for (var i = args.length; i < target; i++) {
            args.push('void 0')
        }

        // Add an unique time-series id
        args.push(`_pref+"f${call_id}"`)

        return src.replace(m[0], `${m[2]}(${args.join(', ')})`)

    }

    // Get the function definition
    // TODO: parse path names like 'this.module1.method(1,2,3)'
    fdef(fname) {
        return this.std[fname].toString()
    }

    // Get args in the function's definition
    get_args(src) {
        let reg = this.regex_clone(FDEFS)
        reg.lastIndex = 0

        let m = reg.exec(src)
        if (!m[3].trim().length) return []
        let arr = m[3].split(',')
            .map(x => x.trim())
            .filter(x => x !== '_id')
        return arr
    }

    regex_clone(rex) {
        return new RegExp(rex.source, rex.flags)
    }
}