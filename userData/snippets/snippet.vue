<script>
var obj = {
  value: 1,
  parent: null,
  childs: [
    {
      value: 2,
      parent: null,
      childs: [
        {
          value: 5,
          parent: null,
          childs: []
        },
        {
          value: 6,
          parent: null,
          childs: []
        },
        {
          value: 7,
          parent: null,
          childs: []
        }
      ]
    },
    {
      value: 3,
      parent: null,
      childs: [
        {
          value: 8,
          parent: null,
          childs: []
        },
        {
          value: 9,
          parent: null,
          childs: []
        },
        {
          value: 10,
          parent: null,
          childs: []
        }
      ]
    },
    {
      value: 4,
      parent: null,
      childs: [
        {
          value: 11,
          parent: null,
          childs: []
        },
        {
          value: 12,
          parent: null,
          childs: []
        },
        {
          value: 13,
          parent: null,
          childs: []
        }
      ]
    }
  ]
}

getFileTest (path) {
  this.getFile(path)
    .then(data => {
      this.json = data
      // console.log(data)
      // this.json = JSON.parse(data)
    })
}
</script>
