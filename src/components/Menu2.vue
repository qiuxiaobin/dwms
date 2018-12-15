<template>
    <div class="menu2">
        <h2>menu2</h2>
        <a-table :columns="columns" :dataSource="dataSource">
          <template slot="operation" slot-scope="text, record">
            <a-button success @click="onClick(record.id)">{{record.name}}</a-button>
          </template>
        </a-table>
    </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String
    },
    year: {
      type: String
    },
    field: {
      type: String
    }
  },
  data() {
    return {
      columns: [
        {
          title: "公司",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "实收信托",
          dataIndex: "data",
          key: "data"
        },
        {
          title: "操作",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" }
        }
      ],
      dataSource: []
    };
  },
  created() {
    this.$axios
      .get("DW/Anu/getBarData", {
        params: {
          field: this.field,
          year: this.year
        }
      })
      .then(({ data }) => {
        if (data.flag > -1) {
          this.dataSource = data.data;
          this.$message.success(data.msg);
        } else {
          this.$message.error(data.msg);
        }
      });
  },
  methods: {
    onClick(id) {
      this.$router.push({ name: "chart3", query: { id, year: this.year } });
    }
  }
};
</script>
