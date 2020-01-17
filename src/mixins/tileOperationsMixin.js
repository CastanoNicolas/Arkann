import { fileHelperMixin } from './fileHelperMixin'

export const tileOperationsMixin = {
  mixins: [fileHelperMixin],
  methods: {
    // createLeaf (context, payload) {
    //   context.commit('setTileExists', false)
    //   var leafObject = {
    //     'id': payload.id,
    //     'displayName': '',
    //     'parent': payload.parentId,
    //     'type': 'leaf',
    //     'image': '',
    //     'fields': [],
    //     'categories': []
    //   }
    //   helpers.getFileFromId(context.state, payload.parentId)
    //     .then(parentTile => {
    //       // get the fields declared in the parent tile
    //       for (const parentField of parentTile.fields) {
    //         var childField = {
    //           'fieldName': parentField.fieldName,
    //           'fieldType': parentField.fieldType,
    //           'fieldValue': '',
    //           'fieldReference': '',
    //           'fieldReferenceName': ''
    //         }
    //         leafObject.fields.push(childField)
    //       }

    //       // categories are inherited from their parent
    //       for (const parentCategory of parentTile.categories) {
    //         leafObject.categories.push(parentCategory)
    //       }

    //       // information needed when the leaf is saved to know if the parent needs to be updated too
    //       // leafObject.neverSaved = true

    //       // update the file cache to be able te load this tile until it is saved
    //       context.commit('updateFileCache', {
    //         'id': payload.Id,
    //         'object': leafObject
    //       })
    //       context.commit('setTileExists', true)
    //     })
    // },
    // createBranch (context, payload) {
    //   context.commit('setTileExists', false)
    //   var branchObject = {
    //     'id': payload.Id,
    //     'displayName': '',
    //     'parent': payload.parentId,
    //     'type': 'branch',
    //     'fields': [],
    //     'categories': [],
    //     'childs': [],
    //     'nbInstance': '0',
    //     'nbSubCategories': '0'
    //   }
    //   helpers.getFileFromId(context.state, payload.parentId)
    //     .then(parentTile => {
    //       // get the fields declared in the parent tile
    //       const uuidv1 = require('uuid/v1')
    //       for (const parentField of parentTile.fields) {
    //         var childField = {
    //           'fieldName': parentField.fieldName,
    //           'fieldType': parentField.fieldType,
    //           'fieldId': uuidv1()
    //         }
    //         branchObject.fields.push(childField)
    //       }

    //       // categories are inherited from their parent
    //       for (const parentCategory of parentTile.categories) {
    //         branchObject.categories.push(parentCategory)
    //       }

    //       // update the file cache to be able te load this tile until it is saved
    //       context.commit('updateFileCache', {
    //         'id': payload.id,
    //         'object': branchObject
    //       })
    //       context.commit('setTileExists', true)
    //     })
    // },
    deleteTile (childId) {
      this.getFileFromId(childId)
        .then(child => {
          this.getFileFromId(child.parent)
            .then(parent => {
              var childs = this.filesRead[parent.id].childs
              // remove the child deleted from the parent tile
              childs.splice(childs.indexOf(childId), 1)
              this.saveFileById(parent.id, parent, parent.type)
              // delete the child tile
              this.deleteFileById(childId)
            })
        })
      this.$store.commit('removeFromFileCache', childId)
      // supprimer le fichier
    }
  },
  computed: {
    filesRead () {
      return this.$store.state.fileModule.filesRead
    }
  }
}
