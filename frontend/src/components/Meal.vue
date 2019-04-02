<template>
    <div>
      <div class="jumbotron jumbotron-fluid">
        <div class="container">
          <h1>Bestellungen</h1>
          <p>
            Hier findet ihr die aktuelle Speisekarte und eine Liste aller Bestellungen.<br>
            Informiert euch vor der Bestellung, was alles auf der Speisekarte steht - dann geht es mit der Bestellaufnahme gleich schneller!
          </p>
        </div>
      </div>
        <div class="container">
          <b-tabs content-class="mt-3">
            <b-tab title="Speisekarte" active>
              <MealMenu :menu="this.menu"></MealMenu>
            </b-tab>
            <b-tab title="Bestellungen">
              <MealOrdersList
                :menu="this.menu"
                :tables="this.tables"
                :orders="this.orders">
                </MealOrdersList>
            </b-tab>
            <b-tab title="Neue Bestellung" v-if="user && user.role == 'admin'">
              <MealOrderNew>
                :menu="this.menu"
                :tables="this.tables"
                :orders="this.orders">
                </MealOrderNew>
            </b-tab>
          </b-tabs>
        </div>
    </div>
</template>

<script>
import Alert from './Alert'
import MealMenu from './MealComponents/MealMenu'
import MealOrdersList from './MealComponents/MealOrdersList'
import MealOrderNew from './MealComponents/MealOrderNew'

const MENU = {
    "sizes": [
        {
            "size": "Normal (27cm)",
            "price": 6
        },
        {
            "size": "Groß (33cm)",
            "price": 9
        }
    ],
    "meals": [
        {
            "id": "06",
            "name": "Vegetaria",
            "description": "Artischocken, Zwiebeln, Paprika, Peperoni"
        },
        {
            "id": "09",
            "name": "Spezial",
            "description": "Salami, Pilze, Schinken, Paprika"
        },
        {
            "id": "10",
            "name": "Teufel",
            "description": "Knoblauch, Peperoni-Wurst, Sardellen"
        },
        {
            "id": "11",
            "name": "Marinara  ",
            "description": "Zwiebeln, Knoblauch, Krabben, Muscheln"
        },
        {
            "id": "12",
            "name": "Pepe",
            "description": "Zwiebeln, Knoblauch, Artischocken, Thunfisch"
        },
        {
            "id": "13",
            "name": "4 Jahreszeiten",
            "description": "Pilze, Paprika, Salami, Schinken, Oliven, Ei"
        },
        {
            "id": "14",
            "name": "Selma",
            "description": "Kapern, Schinken, Spinat, gekochtes Ei"
        },
        {
            "id": "16",
            "name": "Angelica",
            "description": "Pilze, Paprika, Artischocken, Oliven, Schinken"
        },
        {
            "id": "17",
            "name": "Opa",
            "description": "Pilze, Salami, Schinken, Würstchen"
        },
        {
            "id": "18",
            "name": "Hawaii",
            "description": "Pilze, Schinken, Ananas"
        },
        {
            "id": "19",
            "name": "Mediterrana",
            "description": "Erbsen, Blumenkohl, Auberginen"
        },
        {
            "id": "20",
            "name": "Oma",
            "description": "Basilikum, Peperoni-Wurst, Oliven und Mozzarella"
        },
        {
            "id": "21",
            "name": "Quad Form.",
            "description": "4 verschiedene Käsesorten"
        },
        {
            "id": "24",
            "name": "Gorgonzola",
            "description": "Schinken, Gorgonzola"
        },
        {
            "id": "26",
            "name": "Toto",
            "description": "Paprika, Schafskäse, Peperoni, Oliven, frische Tomaten"
        },
        {
            "id": "27",
            "name": "Panna",
            "description": "Sahne, Zwiebeln, Speck und Käse"
        },
        {
            "id": "28",
            "name": "Rucola",
            "description": "Knoblauch, Parmesan, frische Tomaten und Käse"
        },
        {
            "id": "29",
            "name": "Samira",
            "description": "Spinat, Gorgonzola"
        },
        {
            "id": "30",
            "name": "Beniamino",
            "description": "Schinken, Mais, Broccoli"
        },
        {
            "id": "31",
            "name": "Pizza Eva",
            "description": "Mozzarella, Basilikum, frische Tomaten"
        },
        {
            "id": "32",
            "name": "Pizza Adam",
            "description": "Mozzarella, frische Tomaten, Zucchini, Basilikum, Olivenöl und Oregano"
        },
        {
            "id": "33",
            "name": "Istanbul",
            "description": "Sucuk, Peperoni"
        },
        {
            "id": "34",
            "name": "Bosporus",
            "description": "Thunfisch, Zwiebeln, Peperoni"
        },
        {
            "id": "35",
            "name": "Ali Baba",
            "description": "Thunfisch, Schafskäse"
        },
        {
            "id": "36",
            "name": "Napoli",
            "description": "Artischocken, Oliven, Sardellen und Käse"
        }
    ]
};
const TABLES =  [
    {
      "name": "ORGA",
      "seats": 10
    },
    {
      "name": "Alfa",
      "seats": 8
    },
    {
      "name": "Bravo",
      "seats": 8
    },
    {
      "name": "Charlie",
      "seats": 8
    },
    {
      "name": "Delta",
      "seats": 8
    },
    {
      "name": "Echo",
      "seats": 8
    },
    {
      "name": "Foxtrot",
      "seats": 8
    },
    {
      "name": "Golf",
      "seats": 8
    },
    {
      "name": "Hotel",
      "seats": 8
    },
    {
      "name": "India",
      "seats": 8
    },
    {
      "name": "Juliett",
      "seats": 8
    }
  ];

const ORDERS = [
      {
        "id": "1",
        "table": "ORGA",
        "seat": 0,
        "meal": "36",
        "size": "Normal (27cm)",
        "delivered": false
      },
      {
        "id": "2",
        "table": "ORGA",
        "seat": 0,
        "meal": "36",
        "size": "Normal (27cm)",
        "delivered": false
      },
      {
        "id": "3",
        "table": "ORGA",
        "seat": 0,
        "meal": "36",
        "size": "Normal (27cm)",
        "delivered": false
      }
    ];

export default {
  name: 'Meal',
  props:['user'],
  data () {
    return {
        //menu: null,
        //tables: null,
        //orders: null,
        menu: MENU,
        tables: TABLES,
        orders: ORDERS,
        'formatter': new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2
        })
    }
  },
  components: { 
    MealMenu, MealOrdersList, MealOrderNew
  },
  created: function() {
    this.getMealInfo();
  },
  methods: {
    formatError: function(error) {
      if (!error) {
        return "";
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
    },
    getTableSizes: function(){
      if (!this.menu || !this.menu.sizes || !this.menu.sizes.length) return [];
      return arr.map(s=>{return { Größe: s.size, Preis: this.formatter.format(s.price) };});
    },
    getMealInfo: function(event) {
      this.axios
        .get('/meals/fullinfo')
        .then(res => {
          this.menu = res.data.menu;
          this.tables = res.data.tables;
          this.orders = res.data.orders;
        });
    },
    deleteOrders: function(event) {
      var orders = this.info.orders.filter(x => x.selected || false);
      for (var i = 0; i < orders.length; i++) {
        this.axios
          .delete(this.getEndpoint(`orders/${orders[i].id}`))
          .then(res => {
            this.info.orders = res.data;
          }).catch((error) => {
            console.warn(error);
            this.$refs.alertRemove.show('danger','Fehler!', this.formatError(error));
          })
      }
      this.showButton = false;
    },
    newOrder: function(event) {
      var order = event.order;
      this.axios
        .post(this.getEndpoint(), order)
        .then(res => {
          this.info = {orders: res.data};
        }).catch((error) => {
          this.$refs.alertAdd.show('danger','Fehler!', this.formatError(error));
        });
    }
  }
}
</script>