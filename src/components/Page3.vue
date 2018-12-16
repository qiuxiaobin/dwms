<template>
    <div>
        <div class="menu3">{{fieldName}}</div>

        <div>
            <v-chart :options="chartOptions"></v-chart>
        </div>

        <a-table :columns="columns" :dataSource="dataSource">
            <template slot="operation" slot-scope="text, record">
            <a-button success @click="onClick(record.id)">查看详情</a-button>
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
    year: {
      type: String
    },
    companyId: {
      type: String
    },
    field: {
      type: String
    }
  },
  data() {
    return {
      duPointFormulaData: [],
      fields: [],
      companyDatas: []
    };
  },
  computed: {
    chartOptions() {
      debugger;
      return {
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove"
        },
        series: [
          {
            type: "tree",

            data: {
              name: "asdd",
              children: [
                {
                  name: "343243"
                },
                {
                  name: "gregerg"
                }
              ]
            },

            left: "2%",
            right: "2%",
            top: "8%",
            bottom: "20%",

            symbol: "emptyCircle",

            orient: "vertical",

            expandAndCollapse: true,

            label: {
              normal: {
                position: "top",
                rotate: -90,
                verticalAlign: "middle",
                align: "right",
                fontSize: 9
              }
            },

            leaves: {
              label: {
                normal: {
                  position: "bottom",
                  rotate: -90,
                  verticalAlign: "middle",
                  align: "left"
                }
              }
            },

            animationDurationUpdate: 750
          }
        ]
      };
    },
    columns() {
      return [
        {
          title: "公司",
          dataIndex: "companyName",
          key: "companyName"
        },
        {
          title: "年份",
          dataIndex: "year",
          key: "year"
        },
        {
          title: "项目",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "数值",
          dataIndex: "your",
          key: "your"
        },
        {
          title: "平均",
          dataIndex: "avg",
          key: "avg"
        },
        {
          title: "排位",
          dataIndex: "rank",
          key: "rank"
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
    companyName() {
      return (
        (
          this.companyDatas.find(
            ({ companyId }) => companyId == this.companyId
          ) || {}
        ).companyName || ""
      );
    },
    dataSource() {
      return this.duPointFormulaData.map(item => ({
        ...item,
        companyName: this.companyName,
        year: this.year
      }));
    }
  },
  created() {
    this.getDuPointFormulaData();
    this.getFields();
    this.getCompanyDatas();
  },
  methods: {
    getCompanyDatas() {
      this.$axios.get("DW/trustCompany/getCompanyIdDatas").then(({ data }) => {
        if (data.flag > -1) {
          this.companyDatas = data.data;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    getFields() {
      this.$axios.get("DW/Anu/getAnuFields").then(({ data }) => {
        if (data.flag > -1) {
          this.fields = data.data;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    getDuPointFormulaData() {
      this.$axios
        .get("DW/DuPont/getDuPointFormulaData", {
          params: {
            type: this.type,
            year: this.year,
            companyId: this.companyId
          }
        })
        .then(({ data }) => {
          if (data.flag > -1) {
            this.duPointFormulaData = data.data;
            this.$message.success(data.msg);
          } else {
            this.$message.error(data.msg);
          }
        });
    },
    onClick() {}
  }
};
</script>
