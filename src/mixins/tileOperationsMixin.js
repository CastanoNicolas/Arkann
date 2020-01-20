import { fileHelperMixin } from './fileHelperMixin'

export const tileOperationsMixin = {
  mixins: [fileHelperMixin],
  methods: {
    createLeaf (payload) {
      this.$store.commit('setTileExists', false)
      var leafObject = {
        'id': payload.id,
        'displayName': '',
        'parent': payload.parentId,
        'type': 'leaf',
        'image': '',
        'fields': [],
        'categories': []
      }
      this.getFileFromId(payload.parentId)
        .then(parentTile => {
          // get the fields declared in the parent tile
          for (const parentField of parentTile.fields) {
            var childField = {
              'fieldName': parentField.fieldName,
              'fieldType': parentField.fieldType,
              'fieldValue': '',
              'fieldReference': '',
              'fieldReferenceName': ''
            }
            leafObject.fields.push(childField)
          }

          // categories are inherited from their parent
          for (const parentCategory of parentTile.categories) {
            leafObject.categories.push(parentCategory)
          }

          // update the file cache to be able te load this tile until it is saved
          this.$store.commit('updateFileCache', {
            'id': payload.id,
            'object': leafObject
          })
          this.$store.commit('setTileExists', true)
        })
    },
    createBranch (payload) {
      this.$store.commit('setTileExists', false)
      var branchObject = {
        'id': payload.id,
        'displayName': '',
        'parent': payload.parentId,
        'type': 'branch',
        'fields': [],
        'categories': [],
        'childs': [],
        'nbInstance': '0',
        'nbSubCategories': '0'
      }
      this.getFileFromId(payload.parentId)
        .then(parentTile => {
          // get the fields declared in the parent tile
          const uuidv1 = require('uuid/v1')
          for (const parentField of parentTile.fields) {
            var childField = {
              'fieldName': parentField.fieldName,
              'fieldType': parentField.fieldType,
              'fieldId': uuidv1()
            }
            branchObject.fields.push(childField)
          }

          // categories are inherited from their parent
          for (const parentCategory of parentTile.categories) {
            branchObject.categories.push(parentCategory)
          }

          // update the file cache to be able te load this tile until it is saved
          this.$store.commit('updateFileCache', {
            'id': payload.id,
            'object': branchObject
          })
          this.$store.commit('setTileExists', true)
        })
    },
    deleteTile (childId) {
      this.getFileFromId(childId)
        .then(child => {
          this.getFileFromId(child.parent)
            .then(parent => {
              var childs = this.filesRead[parent.id].childs
              // remove the child tile from the parent tile
              childs.splice(childs.indexOf(childId), 1)
              this.saveFileById(parent.id, parent, parent.type)
              
              // remove the child tiles of the deleted tile

              // delete the child tile
              this.deleteFileById(childId)
              this.$store.commit('removeFromFileCache', childId)
            })
        })
    }
  },
  computed: {
    filesRead () {
      return this.$store.state.fileModule.filesRead
    }
  }
}
