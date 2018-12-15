<template>
    <div>
        <h1 class="title">{{companys}}</h1>
        <v-chart :options="chartOptions"></v-chart>

        <a-select v-model="type" @change="getTableData">
          <a-select-option value="company">公司</a-select-option>
          <a-select-option value="region">地域</a-select-option>
        </a-select>
        
        <a-table :columns="columns" :dataSource="dataSource">
          <template slot="operation" slot-scope="text, record">
            <a-button success @click="onClickButton(record.id)">展示{{record.key}}</a-button>
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
    }
  },
  data() {
    return {
      chartOptions: {
        title: {
          text: "ECharts 入门示例"
        },
        tooltip: {},
        legend: {
          data: ["销量"]
        },
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      },
      companys: [],
      type: "company",
      list: [],
      columns: [
        {
          title: "公司",
          dataIndex: "company",
          key: "company"
        },
        {
          title: "年份",
          dataIndex: "year",
          key: "year"
        },
        {
          title: "实收信托",
          dataIndex: "value",
          key: "value"
        },
        {
          title: "操作",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" }
        }
      ],
      dataSource: [],
      value5: []
    };
  },
  watch: {
    field: {
      immediate: true,
      handler() {
        this.getTableData();
      }
    },
    companys: {
      immediate: true,
      handler() {
        this.getLineBarChartData();
      }
    }
  },
  methods: {
    getLineBarChartData() {
      this.$axios
        .get("DW/Anu/getLineBarChartData", {
          params: {
            field: this.field,
            showCompanys: this.companys.join(","),
            rankCompanys: this.companys.join(","),
            type: this.type
          }
        })
        .then(({ data }) => {
          if (data.flag > -1) {
            this.chartData = this.transferCharatDataRows(data.data);
          } else {
            this.$message.error(data.msg);
          }
        });
    },
    transferCharatDataRows(data) {
      this.chartSettings = {
        labelMap: {
          value: data.bar[0].name
        },
        axisSite: {
          right: {
            type: "value"
          }
        }
      };
      return {
        columns: ["year", "value"],
        rows: data.bar[0].data.map(item => ({
          ...item,
          value: item.value && -item.value
        }))
      };
    },
    onClickButton(id) {
      this.companys = [...new Set([id, ...this.companys])];
    },
    getTableData() {
      this.$axios
        .get("DW/Anu/getTableData", {
          params: {
            field: this.field,
            type: this.type
          }
        })
        .then(({ data }) => {
          if (data.flag > -1) {
            this.dataSource = this.transferDataSource(data.data);
          } else {
            this.$message.error(data.msg);
          }
        });
    },
    transferDataSource(data) {
      return data.map(({ id, name, data }) => ({
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
                    value
                  },
                  ...prev
                ],
          []
        )
      }));
    }
  }
};
</script>
