module.exports.EVENT_TYPES = {
    login: 'LOGIN'
}

// 仿照Vue的事件系统封装一个类
class Event {
    constructor() {
        this._listener = {}
    }

    $emit(name, args) {
        if (typeof this._listener[name] === 'undefined') {
            this._register(name)
        }
        for (let i = 0; i < this._listener[name].length; i++) {
            if (typeof this._listener[name][i] === 'function') {
                this._listener[name][i](args)
            }
        }
    }

    $on(name, fn) {
        if (typeof this._listener[name] === 'undefined') {
            this._register(name)
        }
        for (let i = 0; i < this._listener[name].length; i++) {
            if (this._listener[name] === fn) {
                return 'Event already exists'
            }
        }
        this._listener[name].push(fn)
    }

    $off(name, fn) {
        if (this._listener[name]) {
            if (typeof fn === 'function') {
                for (let i = 0; i < this._listener[name].length; i++) {
                    if (this._listener[name][i] === fn) {
                        this._listener[name].splice(i, 1)
                        break
                    }
                }
            } else {
                this._listener[name] = []
            }
        }
    }

    _register(name) {
        this._listener[name] = []
    }
}

module.exports.event =  new Event()