export const tileOperationsMixin = {
  methods: {
    createLeaf (context, payload) {
      context.commit('setTileExists', false)
      var leafObject = {
        'id': payload.id,
        'displayName': '',
        'parent': payload.parentId,
        'type': 'leaf',
        'image': '',
        'fields': [],
        'categories': []
      }
      helpers.getFileFromId(context.state, payload.parentId)
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

          // information needed when the leaf is saved to know if the parent needs to be updated too
          // leafObject.neverSaved = true

          // update the file cache to be able te load this tile until it is saved
          context.commit('updateFileCache', {
            'id': payload.Id,
            'object': leafObject
          })
          context.commit('setTileExists', true)
        })
    },
    createBranch (context, payload) {
      context.commit('setTileExists', false)
      var branchObject = {
        'id': payload.Id,
        'displayName': '',
        'parent': payload.parentId,
        'type': 'branch',
        'fields': [],
        'categories': [],
        'childs': [],
        'nbInstance': '0',
        'nbSubCategories': '0'
      }
      helpers.getFileFromId(context.state, payload.parentId)
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
          context.commit('updateFileCache', {
            'id': payload.id,
            'object': branchObject
          })
          context.commit('setTileExists', true)
        })
    },
    deleteTile (context, childId) {
      helpers.getFileFromId(context.state, childId)
        .then(child => {
          helpers.getFileFromId(context.state, child.parent)
            .then(parent => {
              var payload = {
                'id': childId,
                'parentId': parent.id
              }
              context.commit('removeChildFromParent', payload)
              helpers.saveFileById(context, parent.id, parent, parent.type)
              helpers.deleteFileById(context, payload.id)
            })
        })
      context.commit('removeFromFileCache', childId)
      // supprimer le fichier
    }
  },
  computed: {
    currentTile () {
      return this.$store.state.navigationModule.currentTile
    }
  }
}
