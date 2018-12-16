<template>
    <div>
        <div>
          <span :class="$style.fieldName">{{fieldName}}</span>
        </div>

        <div :class="$style.setting">
          <a-select v-model="type" @change="getTableData">
            <a-select-option value="company">公司</a-select-option>
            <a-select-option value="region">地域</a-select-option>
          </a-select>
        </div>

        <div :class="$style.chartContainer">
          <v-chart :class="$style.chart" ref="chart" :options="chartOptions" @click="onChartClick"></v-chart>
        </div>
        
        <a-table :class="$style.table" :columns="columns" :dataSource="dataSource">
          <template slot="operation" slot-scope="text, record">
            <a-button v-if="!record.isChild" :type="chartTarget.includes(record.id) ? 'danger' : 'primary'" @click="onClickButton(record.id)">{{chartTarget.includes(record.id) ? '取消展示' : '展示'}}</a-button>
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
    field: {
      type: String
    },
    code: {
      type: String
    }
  },
  data() {
    return {
      chartData: {},
      tableData: [],
      fields: [],
      companys: [],
      regions: [],
      type: "company",
      list: []
    };
  },
  computed: {
    chartTarget() {
      return {
        company: this.companys,
        region: this.regions
      }[this.type];
    },
    typeName() {
      return {
        company: "公司",
        region: "地域"
      }[this.type];
    },
    columns() {
      return [
        {
          title: this.typeName,
          dataIndex: "company",
          key: "company"
        },
        {
          title: "年份",
          dataIndex: "year",
          key: "year"
        },
        {
          title: this.fieldName,
          dataIndex: "value",
          key: "value"
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
    },
    dataSource() {
      return this.tableData.map(({ id, name, data }) => ({
        id,
        key: id + "|" + data[data.length - 1].year,
        company: name,
        year: data[data.length - 1].year,
        value: data[data.length - 1].value,
        children: data.reduce(
          (prev, { year, value }, index) =>
            index == data.length - 1
              ? prev
              : [
                  {
                    id,
                    key: id + "|" + year,
                    company: name,
                    year,
                    value,
                    isChild: true
                  },
                  ...prev
                ],
          []
        )
      }));
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
        legend: {
          type: "scroll",
          data: (this.chartData.line || []).map(({ name }) => name)
        },
        xAxis: [
          {
            type: "category",
            data: [
              2005,
              2006,
              2007,
              2008,
              2009,
              2010,
              2011,
              2012,
              2013,
              2014,
              2015,
              2016,
              2017
            ]
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "金额(万元)"
          },
          {
            type: "value",
            axisLabel: {
              formatter: value => -value
            },
            name: "排名"
          }
        ],
        series: [
          ...(this.chartData.line || []).map(({ name, id, data }) => ({
            name,
            _id: id,
            type: "line",
            data
          })),
          ...(this.chartData.bar || []).map(({ name, id, data }) => ({
            name,
            _id: id,
            type: "bar",
            data: data.map(({ value }) => -value || null),
            yAxisIndex: 1
          }))
        ]
      };
    }
  },
  watch: {
    field: {
      immediate: true,
      handler() {
        this.chartData = {};
        this.companys = [];
        this.regions = [];
        this.getFields();
        this.getTableData();
      }
    },
    chartTarget: {
      immediate: true,
      handler() {
        if (this.chartTarget.length > 0) {
          this.getLineBarChartData();
        }
      }
    }
  },
  methods: {
    onChartClick(params) {
      const id = this.chartOptions.series[params.seriesIndex]._id;
      const path = `${this.$route.path}/${this.type}/${params.name}/${id}`;

      this.$router.push({
        path
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
    getLineBarChartData() {
      this.$axios
        .get("/DW/Anu/getLineBarChartData", {
          params: {
            field: this.field,
            showCompanys: this.companys.join(","),
            rankCompanys: this.companys.join(","),
            type: this.type
          }
        })
        .then(({ data }) => {
          if (data.flag > -1) {
            this.chartData = data.data;
          } else {
            this.$message.error(data.msg);
          }
        });
    },
    onClickButton(id) {
      if (this.chartTarget.includes(id)) {
        if (this.chartTarget.length > 1) {
          this.chartTarget.splice(this.chartTarget.indexOf(id), 1);
        } else {
          this.$message.error(`至少选择一个${this.typeName}`);
        }
      } else {
        this.chartTarget.push(id);
      }
    },
    getTableData() {
      this.$axios
        .get("/DW/Anu/getTableData", {
          params: {
            field: this.field,
            type: this.type
          }
        })
        .then(({ data }) => {
          if (data.flag > -1) {
            this.tableData = data.data;
          } else {
            this.$message.error(data.msg);
          }
        });
    }
  }
};
</script>

<style module>
.chartContainer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.chart {
  margin-top: 47px;
  width: 900px !important;
}
.fieldName {
  font-size: 16px;
  line-height: 16px;
  color: #3664ff;
}
.setting {
  margin-top: 34px;
}

.table {
  margin-top: 28px;
}
</style>
