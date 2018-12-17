<template>
    <div>
        <div>
          <span :class="$style.fieldName">{{fieldName}}</span>
        </div>

        <div :class="$style.setting">
          <a-button @click="onBackClick">返回</a-button>
        </div>

        <div :class="$style.chartContainer">
          <v-chart :class="$style.chart" :options="chartOptions" @click="onChartClick"></v-chart>
        </div>

        <a-table :class="$style.table" :columns="columns" :dataSource="dataSource">
          <template v-if="field == 'dupont'" slot="operation" slot-scope="text, record">
            <a-button success @click="onButtonClick(record.id)">查看详情</a-button>
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
          boundaryGap: true,
          axisLabel: {
            formatter: value => (value || "").split("").join("\n"),
            interval: 0
          },
          axisTick: {
            alignWithLabel: true
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
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
        this.field == "dupont"
          ? {
              title: "操作",
              dataIndex: "operation",
              scopedSlots: { customRender: "operation" }
            }
          : {}
      ];
    },
    fieldName() {
      return (
        (this.fields.find(({ code }) => code == this.field) || {}).name || ""
      );
    }
  },
  created() {
    this.getBarData();
  },
  methods: {
    getBarData() {
      this.$axios
        .get("/DW/Anu/getBarData", {
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
    getFields() {
      this.$axios.get("/DW/Anu/getAnuFields").then(({ data }) => {
        if (data.flag > -1) {
          this.fields = data.data;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    onChartClick(params) {
      if (this.field !== "dupont") return;
      const companyId = this.dataSource[params.dataIndex].id;
      const path = `${this.$route.path}/${companyId}`;

      this.$router.push({
        path
      });
    },
    onButtonClick(companyId) {
      const path = `${this.$route.path}/${companyId}`;

      this.$router.push({
        path
      });
    },
    onBackClick(){
      this.$router.back();
    }
  }
};
</script>

<style module>
.fieldName {
  font-size: 16px;
  line-height: 16px;
  color: #3664ff;
}
.chartContainer {
  display: flex;
  justify-content: center;
  align-items: center;
}
.chart {
  width: 1000px !important;
}
.table {
  margin-top: 28px;
}
.setting{
  margin-top: 34px;
}
</style>
