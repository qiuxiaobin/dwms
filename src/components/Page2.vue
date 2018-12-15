<template>
    <div class="menu2">
        <div>
          <h1 :class="$style.fieldName">{{fieldName}}</h1>
        </div>

        <v-chart :class="$style.chart" :options="chartOptions"></v-chart>

        <a-table :columns="columns" :dataSource="dataSource">
          <template slot="operation" slot-scope="text, record">
            <a-button success @click="onClick(record.id)">{{record.name}}</a-button>
          </template>
        </a-table>
    </div>
</template>

<script>
import ECharts from "vue-echarts";

export default {
  components: {
    "v-chart": ECharts
  },
  props: {
    type: {
      type: String
    },
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
      barData: [],
      fields: []
    };
  },
  watch: {
    field: {
      immediate: true,
      handler() {
        this.getFields();
      }
    }
  },
  computed: {
    dataSource() {
      return this.barData.map(item => ({ ...item, year: this.year }));
    },
    chartOptions() {
      return {
        dataZoom: [
          {
            type: "inside",
            xAxisIndex: 0
          }
        ],
        tooltip: {},
        xAxis: {
          type: "category",
          data: this.dataSource.map(({ name }) => name)
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: this.dataSource.map(({ data }) => data),
            type: "bar"
          }
        ]
      };
    },
    columns() {
      return [
        {
          title: "公司",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "年份",
          dataIndex: "year",
          key: "year"
        },
        {
          title: this.fieldName,
          dataIndex: "data",
          key: "data"
        },
        {
          title: "操作",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" }
        }
      ];
    },
    fieldName() {
      return (
        (this.fields.find(({ code }) => code == this.field) || {}).name || ""
      );
    }
  },
  created() {
    this.$axios
      .get("DW/Anu/getBarData", {
        params: {
          type: this.type,
          field: this.field,
          year: this.year
        }
      })
      .then(({ data }) => {
        if (data.flag > -1) {
          this.barData = data.data;
          this.$message.success(data.msg);
        } else {
          this.$message.error(data.msg);
        }
      });
  },
  methods: {
    getFields() {
      this.$axios.get("DW/Anu/getAnuFields").then(({ data }) => {
        if (data.flag > -1) {
          this.fields = data.data;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    onClick(id) {
      this.$router.push({ name: "chart3", query: { id, year: this.year } });
    }
  }
};
</script>

<style module>
.chart {
  width: 1200px;
}
</style>
