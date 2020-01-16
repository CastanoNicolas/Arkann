import { fileHelperMixin } from './fileHelperMixin'

export const browseMixin = {
  mixins: [fileHelperMixin],
  data () {
    return {
      cards: [],
      cardsCategories: [
        { label: 'All', value: 'All' }
      ]
    }
  },
  methods: {
    getCards (id) {
      // %TODO% check if there isn't a safer way to check id => like if there is a wrong id what are you doing ?
      this.cards = []
      this.cardsCategories = [
        { label: 'All', value: 'All' }
      ]

      this.getFileFromId(id)
        .then(currentTile => {
          var childsIds = currentTile.childs
          for (const childId of childsIds) {
            this.getFileFromId(childId)
              .then(childTile => {
                var card = this.buildCard(childTile)
                this.cards.push(card)
              },
              error => {
                console.log(error)
              })
          }
        },
        error => {
          console.log(error)
        })
    },
    // childTile is the js object corresponding to the child json file
    buildCard (childTile) {
      // build the card object
      var card = {
        id: childTile.id,
        displayName: childTile.displayName,
        type: childTile.type,
        categories: childTile.categories,
        isDisplayable: true
      }
      // add fields if it is a 'branch'
      if (childTile.type === 'branch') {
        card.nbInstance = childTile.nbInstance
        card.nbSubCategories = childTile.nbSubCategories
      }
      // build an array of the categories encountered to sort tiles afterwards
      for (const cat of childTile.categories) {
        var toBeInserted = {
          label: cat,
          value: cat
        }
        if (!(this.cardsCategories.some(category => category.label === toBeInserted.label))) {
          this.cardsCategories.push(toBeInserted)
        }
      }
      return card
    }
  }
}
