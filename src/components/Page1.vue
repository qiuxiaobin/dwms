<template>
  <div>
    <a-button :class="$style.reportBtn" v-show="this.field=='dupont'">生成分析报告</a-button>
    <div :class="$style.head">
      <span :class="$style.fieldName">{{fieldName}}</span>
    </div>
    <div :class="$style.setting">业务类型：
      <a-select :class="$style.type" v-model="type" @change="getTableData">
        <a-select-option value="company">公司</a-select-option>
        <a-select-option value="region">地域</a-select-option>
        <a-select-option value="nature">公司性质</a-select-option>
        <a-select-option value="member">人员数量</a-select-option>
        <a-select-option value="registered">注册资金</a-select-option>
      </a-select>
      <a-checkbox :class="$style.showRank" v-model="showRank">显示排名</a-checkbox>
    </div>
    <div :class="$style.chartContainer">
      <v-chart :class="$style.chart" ref="chart" :options="chartOptions" @click="onChartClick"></v-chart>
    </div>
    <a-input-search
      :class="$style.tableSearch"
      :placeholder="'请输入要查找的' + typeName"
      @search="onTableSearch"
    ></a-input-search>
    <a-table :class="$style.table" :columns="columns" :dataSource="dataSource">
      <template slot="operation" slot-scope="text, record">
        <a-button :class="$style.searchButton" @click="onDetailClick(record.year, record.id)">查看详情</a-button>
        <a-button
          v-if="!record.isChild"
          :type="chartTarget.includes(record.id) ? 'danger' : 'primary'"
          @click="onClickButton(record.id)"
        >{{chartTarget.includes(record.id) ? '取消展示' : '展示'}}</a-button>
      </template>
    </a-table>
  </div>
</template>

<script>
import ECharts from "vue-echarts";
import { formatterNumber } from "@utils";
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
      unit: "",
      tableData: [],
      fields: [],
      companys: [],
      regions: [],
      natures: [],
      members: [],
      registereds: [],
      type: "company",
      list: [],
      searchName: "",
      showRank: true
    };
  },
  computed: {
    chartTarget() {
      return {
        company: this.companys,
        region: this.regions,
        nature: this.natures,
        member: this.members,
        registered: this.registereds
      }[this.type];
    },
    typeName() {
      return {
        company: "公司",
        region: "地域",
        nature: "公司性质",
        member: "人员数量",
        registered: "注册资金"
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
      return this.tableData
        .filter(({ name }) => name.indexOf(this.searchName) > -1)
        .map(({ id, name, data }) => ({
          id,
          key: id + "|" + data[data.length - 1].year,
          company: name,
          year: data[data.length - 1].year,
          value: formatterNumber(data[data.length - 1].value, this.unit),
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
                      value: formatterNumber(value, this.unit),
                      isChild: true
                    },
                    ...prev
                  ],
            []
          )
        }));
    },
    chartOptions() {
      let series = [
        ...(this.chartData.line || []).map(({ name, id, data }) => ({
          name,
          _id: id,
          type: "line",
          data
        }))
      ];

      series = this.showRank
        ? [
            ...series,
            ...(this.chartData.bar || []).map(({ name, id, data }) => ({
              name,
              _id: id,
              type: "bar",
              barMaxWidth: "35",
              data: data.map(({ value }) => -value || null),
              yAxisIndex: 1
            }))
          ]
        : series;

      return {
        dataZoom: [
          {
            type: "inside"
          }
        ],
        tooltip: {
          formatter: params => {
            if (params.seriesName == "最低值") {
              return (
                "年份：" +
                params.name +
                "<br>最低值：" +
                formatterNumber(params.value, this.unit) +
                "<br>公司：" +
                series[params.seriesIndex].data[params.dataIndex].company
              );
            } else if (params.seriesName == "最高值") {
              return (
                "年份：" +
                params.name +
                "<br>最高值：" +
                formatterNumber(params.value, this.unit) +
                "<br>公司：" +
                series[params.seriesIndex].data[params.dataIndex].company
              );
            } else if (params.seriesName == "平均值") {
              return (
                "年份：" +
                params.name +
                "<br>平均值：" +
                formatterNumber(params.value, this.unit)
              );
            } else {
              if (params.seriesType == "bar") {
                return (
                  "公司：" +
                  params.seriesName +
                  "<br>年份：" +
                  params.name +
                  "<br>排名：" +
                  -params.value
                );
              } else {
                return (
                  this.typeName +
                  "：" +
                  params.seriesName +
                  "<br>年份：" +
                  params.name +
                  (this.type != "company" ? "<br>平均值" : "<br>金额") +
                  "：" +
                  formatterNumber(params.value, this.unit)
                );
              }
            }
          }
        },
        legend: {
          type: "scroll",
          data: (this.chartData.line || []).map(({ name }) => name)
        },
        xAxis: [
          {
            type: "category",
            data:
              this.chartData.line && this.chartData.line.length
                ? this.chartData.line[0].data.map(({ year }) => year)
                : []
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "单位:" + this.unit
          },
          this.showRank
            ? {
                type: "value",
                axisLabel: {
                  formatter: value => -value
                },
                name: "排名"
              }
            : null
        ],
        series
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
        this.natures = [];
        this.members = [];
        this.registereds = [];
        this.getFields();
        this.getTableData();
      }
    },
    chartTarget: {
      immediate: true,
      handler() {
        this.getLineBarChartData();
      }
    }
  },
  methods: {
    onTableSearch(name) {
      this.searchName = name;
    },
    onChartClick(params) {
      const id = this.chartOptions.series[params.seriesIndex]._id;
      const path = `${this.$route.path}/${this.type}/${params.name}/${id}`;

      this.$router.push({
        path
      });
    },
    onDetailClick(year, id) {
      this.$router.push({
        path: `${this.$route.path}/${this.type}/${year}/${id}`
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
            showCompanys: this.chartTarget.join(","),
            rankCompanys: this.chartTarget.join(","),
            type: this.type
          }
        })
        .then(({ data }) => {
          if (data.flag > -1) {
            this.unit = data.unit;
            this.chartData = data.data;
            console.log(this.chartData);
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
.reportBtn {
  position: absolute;
  top: 23px;
  right: 24px;
}
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
.table td {
  padding: 10px 16px !important;
}
.tableSearch {
  width: 200px;
}
.searchButton {
  margin-right: 10px;
}
.showRank {
  margin-left: 15px;
}
.type {
  width: 100px;
  margin-left: 10px;
}
.head {
  height: 20px;
}
</style>
