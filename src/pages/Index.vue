<template>
  <q-page class="flex flex-center">
    <button @click="getTilesToDisplay('1553cb4b-f103-4634-8d38-a415e2013e6e')"> Click and Pray ! </button>
    <p>{{tilesToDisplay}}</p>
  </q-page>
</template>

<script>
import { Platform } from 'quasar'

export default {
  name: 'name',
  data () {
    return {
      json: 'lala',
      lookupTable: {},
      tilesToDisplay: [],
      currentWorldPath: './userData/Juko/World1/'
    }
  },
  computed: {
    lookupTablePath: function () {
      return this.currentWorldPath + 'lookupTable.json'
    }
  },
  created () {
    this.getFile(this.lookupTablePath)
      .then(data => {
        this.lookupTable = JSON.parse(data)
      },
      err => {
        console.log(err)
      })
  },
  methods: {
    getFile (path) {
      return new Promise((resolve, reject) => {
        if (Platform.is.electron) {
          try {
            const fs = require('fs')

            fs.readFile(path, 'utf-8', (error, data) => {
              if (error) {
                reject(error)
              } else {
                resolve(data)
              }
            })
          } catch (error) {
            console.log('Failed to load module "fs"', error)
            throw error
          }
        } else {
          throw new Error('Not yet implemented')
          // https://forum.quasar-framework.org/topic/384/help-loading-local-json-file-in-either-web-or-electron-contexts
        }
      })
    },
    getFilePathFromID (ID) {
      console.log('Looking for' + ID + 'and CRP : lt[ID]' + this.currentWorldPath + ' : ' + this.lookupTable[ID])
      return this.currentWorldPath + this.lookupTable[ID]
    },
    getTilesToDisplay (ID, root = false) {
      // %TODO% check if there insn't a safer way to check ID
      var path
      if (ID !== null) {
        path = this.getFilePathFromID(ID)
      } else {
        path = this.getFilePathFromID('rootID')
      }
      // %TODO% audit this code quality, it smells ...
      this.getFile(path)
        .then(data => {
          console.log(data)
          var currentTile = JSON.parse(data)
          console.log(currentTile)
          var childsIDs = currentTile.childs
          for (const childID of childsIDs) {
            this.getFile(this.getFilePathFromID(childID))
              .then(data => {
                var childTile = JSON.parse(data)
                this.tilesToDisplay.push({
                  id: childTile.id,
                  displayName: childTile.displayName,
                  description: childTile.description
                })
              },
              error => {
                console.log(error)
                alert(this.$t('error'))
              })
          }
        },
        error => {
          console.log(error)
          alert(this.$t('error'))
        })
    }
  }
}
</script>
