<template>
    <div>
        <div class="menu3">{{fieldName}}</div>

        <div :class="$style.chartContainer">
            <div :class="$style.box">
              <span>净资产收益率</span>
              <div :class="$style.yLineCenter">
                <div :class="$style.xLine">
                  <div :class="$style.yLineLeft">
                    <div :class="$style.childBox">
                      <span>总资产收益率</span>
                      <div :class="$style.yLineCenter">
                        <div :class="$style.xLine2">
                            <div :class="$style.yLineLeft">
                              <div :class="$style.childBox">
                                <span>销售净利率</span>
                                <div :class="$style.yLineCenter">
                                  <div :class="$style.xLine3">
                                      <div :class="$style.yLineLeft">
                                        <div :class="$style.childBox">
                                          <span>净利润</span> 
                                        </div>
                                      </div>
                                      <div :class="$style.yLineRight">
                                        <div :class="$style.childBox">
                                          <span>销售收入</span> 
                                        </div>
                                      </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div :class="$style.yLineRight">
                              <div :class="$style.childBox">
                                  <span>总资产周转率</span> 
                                  <div :class="$style.yLineCenter">
                                    <div :class="$style.xLine4">
                                        <div :class="$style.yLineLeft">
                                          <div :class="$style.childBox">
                                            <span>销售收入</span> 
                                          </div>
                                        </div>
                                        <div :class="$style.yLineRight">
                                          <div :class="$style.childBox">
                                            <span>资产总额</span> 
                                          </div>
                                        </div>
                                    </div>
                                  </div>
                                </div>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div :class="$style.yLineRight">
                    <div :class="$style.childBox">
                      <span>权益乘数</span>
                      <div :class="$style.yLineCenter">
                        <div :class="$style.xLine5">
                          <div :class="$style.yLineRight">
                            <div :class="$style.childBox">
                              <span>=1/(1-资产负债率)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

            data: [
              {
                name: "asdd",
                children: [
                  {
                    name: "343243",
                    value: 300
                  },
                  {
                    name: "gregerg",
                    value: 400
                  }
                ]
              }
            ],

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
      this.$axios.get("/DW/trustCompany/getCompanyIdDatas").then(({ data }) => {
        if (data.flag > -1) {
          this.companyDatas = data.data;
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
    getDuPointFormulaData() {
      this.$axios
        .get("/DW/DuPont/getDuPointFormulaData", {
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

<style module>
.chartContainer {
  display: flex;
  justify-content: center;
  height: 250px;
}
.box {
  position: relative;
  height: 30px;
  line-height: 28px;
  border: 1px solid #d7d8db;
  border-radius: 15px;
  padding: 0 16px;
  color: #7b94fe;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
}
.yLine {
  position: absolute;
  bottom: -16px;
  width: 1px;
  height: 16px;
  background-color: #d7d8db;
}
.xLine {
  position: absolute;
  left: 50%;
  bottom: -1px;
  width: 237px;
  height: 1px;
  margin-left: -118.5px;
  background-color: #d7d8db;
}
.xLine2 {
  composes: xLine;
  width: 305px;
  margin-left: -152.5px;
}
.xLine3 {
  composes: xLine;
  width: 189px;
  margin-left: -94.5px;
}
.xLine4 {
  composes: xLine;
  width: 197px;
  margin-left: -98.5px;
}
.xLine5 {
  composes: xLine;
  left: 0;
  width: 128px;
  margin-left: 0;
}
.yLineCenter {
  composes: yLine;
  left: 50%;
  margin-left: -0.5px;
}
.yLineLeft {
  composes: yLine;
  left: 0;
  margin-left: 0;
}
.yLineRight {
  composes: yLine;
  right: 0;
  margin-left: 0;
}
.childBox {
  composes: box;
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 100%);
}
</style>
