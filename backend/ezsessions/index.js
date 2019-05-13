const uuid = require('uuid')
const COOKIE_NAME = "uw0tm8";

class ezsession {
    constructor() {
        this.sessions = {};
    }

    getUser(sessionid) {
        if (!sessionid) return null;
        return this.sessions[sessionid];
    }

    generateCookie(req, res, user, callback) {
        var id = uuid.v4();
        this.sessions[id] = user;
        res.append("set-cookie", this.getCookieString(COOKIE_NAME, id, 1));
        callback(req, res);
    }

    destroyCookie(req, res, callback) {
        var id = req.cookies[COOKIE_NAME];
        this.sessions[id] = undefined;
        callback(req, res);
    }

    getCookieString(cname, cvalue, exhour) {
        var d = new Date();
        d.setTime(d.getTime() + (exhour*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        //if(process.env.NODE_ENV === "production")
        //    return cname + "=" + cvalue + ";" + expires + ";path=/;HttpOnly;secure";
        //else
            return cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    verifyCookie(req, res, callback) {
        var id = (req.cookies ? req.cookies[COOKIE_NAME] : undefined);
        var user = this.getUser(id);
        if (!id || !user) return res.status(403).send({err: "Not logged in"});
        req.user = user;
        callback(req, res);
    }
}
var _session = new ezsession();

module.exports = _session;