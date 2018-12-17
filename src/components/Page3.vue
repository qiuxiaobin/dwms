<template>
  <div>
    <div>
      <span :class="$style.fieldName">{{fieldName}}</span>
    </div>

    <div :class="$style.chartContainer">
      <div>
        <div :class="$style.box">
          <boxContent
            @click="onBoxContentClick"
            :data="boxContentDataMap.dupont"
          ></boxContent>
          <div :class="$style.yLineCenter">
            <div :class="$style.xLine">
              <div :class="$style.yLineLeft">
                <div :class="$style.childBox">
                  <boxContent
                    @click="onBoxContentClick"
                    :data="boxContentDataMap.totalAssetsRate"
                  >总资产收益率</boxContent>
                  <div :class="$style.yLineCenter">
                    <div :class="$style.xLine2">
                      <div :class="$style.yLineLeft">
                        <div :class="$style.childBox">
                          <boxContent
                            @click="onBoxContentClick"
                            :data="boxContentDataMap.salesInterestRate"
                          >销售净利率</boxContent>
                          <div :class="$style.yLineCenter">
                            <div :class="$style.xLine3">
                              <div :class="$style.yLineLeft">
                                <div :class="$style.childBox">
                                  <boxContent
                                    @click="onBoxContentClick"
                                    :data="boxContentDataMap.netProfit"
                                  >净利润</boxContent>
                                </div>
                              </div>
                              <div :class="$style.yLineRight">
                                <div :class="$style.childBox">
                                  <boxContent
                                    @click="onBoxContentClick"
                                    :data="boxContentDataMap.totalAssetsRate"
                                  >销售收入</boxContent>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div :class="$style.yLineRight">
                        <div :class="$style.childBox">
                          <boxContent
                            @click="onBoxContentClick"
                            :data="boxContentDataMap.totalAssetsTurnover"
                          >总资产周转率</boxContent>
                          <div :class="$style.yLineCenter">
                            <div :class="$style.xLine4">
                              <div :class="$style.yLineLeft">
                                <div :class="$style.childBox">
                                  <boxContent
                                    @click="onBoxContentClick"
                                    :data="boxContentDataMap.salesRevenue"
                                  >销售收入</boxContent>
                                </div>
                              </div>
                              <div :class="$style.yLineRight">
                                <div :class="$style.childBox">
                                  <boxContent
                                    @click="onBoxContentClick"
                                    :data="boxContentDataMap.totalAssets"
                                  >资产总额</boxContent>
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
                  <boxContent
                    @click="onBoxContentClick"
                    :data="boxContentDataMap.equityMultiplier"
                  >权益乘数</boxContent>
                  <div :class="$style.yLineCenter">
                    <div :class="$style.xLine5">
                      <div :class="$style.yLineRight">
                        <div :class="$style.childBox">
                          <boxContent
                            @click="onBoxContentClick"
                            :data="boxContentDataMap.assetLiabilityRatio"
                          >=1/(1-资产负债率)</boxContent>
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
    </div>

    <a-table
      :columns="columns"
      :dataSource="dataSource"
    >
      <template
        slot="operation"
        slot-scope="text, record"
      >
        <a-button
          success
          @click="onClick(record.code)"
        >查看详情</a-button>
      </template>
    </a-table>
  </div>
</template>

<script>
import boxContent from "@components/boxContent";

export default {
  components: {
    boxContent
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
    boxContentDataMap() {
      const map = {};
      this.duPointFormulaData.forEach(item => {
        map[item.code] = item;
      });

      return map;
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
    onClick(code) {
      // this.$message.error(`暂未支持(code:${code})`);
      this.$router.push({
        path: `/analysis/${code}/company/${this.year}/${this.companyId}`
      });
      // this.$router.push({path: `${this.$route.path}/${code}`})
    },
    onBoxContentClick(code) {
      // this.$message.error(`暂未支持(code:${code})`);
      this.$router.push({
        path: `/analysis/${code}/company/${this.year}/${this.companyId}`
      });
      // this.$router.push({path: `${this.$route.path}/${code}`})
    }
  }
};
</script>

<style module>
.chartContainer {
  display: flex;
  justify-content: center;
  height: 250px;
  margin: 28px 0;
}
.box {
  position: relative;
  border: 1px solid #d7d8db;
  border-radius: 15px;
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
.fieldName {
  font-size: 16px;
  line-height: 16px;
  color: #3664ff;
}
</style>
