import axios from 'axios'

export default class api {
    constructor(host) {
        this._host = host;
        this._user = null;
        this._menu = null;
        this._tables = null;
        this._orders = null;
        this._ordersByTables = null;
        this._undeliveredOrders = null;
        this._unpaidOrders = null;
    }

    get host() { return this._host; }
    get user() { return this._user; }
    get menu() { return this._menu; }
    get tables() { return this._tables; }
    get orders() { return this._orders; }
    get ordersByTables() { return this._ordersByTables; };
    get undeliveredOrders() { return this._undeliveredOrders; };
    get unpaidOrders() { return this._unpaidOrders; };

    getUrl(endpoint) { return `${this.host}/api${endpoint}`; }

    updateOrdersByTables() {
        if (!this._tables || !this._menu || !this._orders) return this._ordersByTables = [];
        this._ordersByTables = this._tables.map(table => {
            return {
                "table": table,
                table: table,
                seats: Array.apply(null, { length: table.seats })
                    .map(Number.call, Number)
                    .map(s => {
                    return {
                        seat: s,
                        orders: this._orders
                        .filter(order => order.table == table.name && order.seat == s)
                        .map(order => {
                            return {
                            id: order.id,
                            seat: s,
                            state: order.state,
                            size: this._menu.sizes.find(size => size.size == order.size),
                            meal: this._menu.meals.find(meal => meal.id == order.meal)
                            };
                        })
                    };
                })
            }
        });
    }

    getOrdersByState(state) {
        if (!this._tables || !this._menu || !this._orders) return [];
        return this._menu.meals.map(meal => {
            return {
                "id": meal.id,
                "orders": this._orders
                    .filter(order => order.meal == meal.id && order.state == state)
                    .map(order => {
                        return {
                        id: order.id,
                        seat: order.seat,
                        state: order.state,
                        size: this._menu.sizes.find(size => size.size == order.size),
                        meal: this._menu.meals.find(meal => meal.id == order.meal)
                        };
                    })
            }
        });
    }

    getAuthStatus(cb) {
        axios
            .get(this.getUrl("/auth/status"))
            .then(res => {
                this._user = res.data.user;
                cb(null, this._user);
            })
            .catch(err => cb(err));
    }

    login(username, password, cb) {
        axios
            .post(this.getUrl("/auth/login"), {
                username: username,
                password: password
            })
            .then(res => {
                this._user = res.data.user;
                cb(null, this._user);
            })
            .catch(err => cb(err));
    }

    logout(cb) {
        if (!this._user) return cb({ msg: "Not logged in" });

        axios
            .post(this.getUrl("/auth/logout"))
            .then(res => {
                this._user = null;
                cb();
            })
            .catch(err => cb(err));
    }

    getFullInfo(cb) {
        axios
            .get(this.getUrl('/meals/fullinfo'))
            .then(res => {
                this._menu = res.data.menu;
                this._tables = res.data.tables;
                this._orders = res.data.orders;
                this.updateOrdersByTables();
                this._unpaidOrders = this.getOrdersByState(0);
                this._undeliveredOrders = this.getOrdersByState(1);
                cb(null, {
                    menu: this._menu,
                    tables: this._tables,
                    orders: this._orders
                });
            })
            .catch(err => cb(err));
    }

    createOrder(table, seat, mealId, size, cb) {
        axios
            .post(this.getUrl('/meals/order'), {
                table: table,
                seat: seat,
                mealId: mealId,
                size: size
            })
            .then(res => {
                this._orders.push(res.data);
                this.updateOrdersByTables();
                this._unpaidOrders = this.getOrdersByState(0);
                this._undeliveredOrders = this.getOrdersByState(1);
                cb(null, res.data);
            })
            .catch(err => cb(err));
    }

    deleteOrder(orderId, cb) {
        axios
            .delete(this.getUrl('/meals/order/' + orderId))
            .then(res => {
                var order = this._orders.find(x => x.id == res.data.id);
                if (order) this._orders.splice(this._orders.indexOf(order), 1);
                this.updateOrdersByTables();
                this._unpaidOrders = this.getOrdersByState(0);
                this._undeliveredOrders = this.getOrdersByState(1);
                cb(null, res.data);
            })
            .catch(err => cb(err));
    }

    //router.put('/order/:id/state/:value',
    setOrderState(orderId, state, cb) {
        axios
            .put(this.getUrl(`/meals/order/${orderId}/state/${state}`))
            .then(res => {
                var order = this._orders.find(x => x.id == res.data.id);
                this._orders[this._orders.indexOf(order)] = res.data;
                this.updateOrdersByTables();
                this._unpaidOrders = this.getOrdersByState(0);
                this._undeliveredOrders = this.getOrdersByState(1);
                cb(null, res.data);
            })
            .catch(err => cb(err));
    }

    formatError(error) {
        if (!error) {
            console.log(error);
            return "NO ERROR?";
        } else {
            if (error.response) {
                if (error.response.data) {
                    return `${error.response.data} (${error.response.status} - ${error.response.statusText})`;
                }
                return `${error.response.status} - ${error.response.statusText}`;
            } else {
                return "Keine Antwort."
            }
        }
    }
}