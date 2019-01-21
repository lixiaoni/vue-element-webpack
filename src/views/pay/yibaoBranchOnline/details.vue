<template>
  <div v-loading.body="listLoading" style="padding:30px;">
    <div class="block yb-lable">
      <el-form
        :inline="true"
        :label-width="formLabelWidth"
        :model="merchantVOData"
        :rules="rules"
        :ref="merchantVOData"
        class="demo-form-inline"
      >
        <div class="clearfix">
          <span>基本信息</span>
        </div>
        <el-form-item label="联系人：" prop="linkman">
          <el-input :readonly="readonly" v-model="merchantVOData.linkman"/>
        </el-form-item>
        <el-form-item label="商户名称：" prop="merchantName">
          <el-input :readonly="readonly" v-model="merchantVOData.merchantName"/>
        </el-form-item>
        <el-form-item label="商户简称：" prop="merchantAbbre">
          <el-input :readonly="readonly" v-model="merchantVOData.merchantAbbre"/>
        </el-form-item>
        <el-form-item label="联系电话：" prop="linkmanPhone">
          <el-input :readonly="readonly" v-model="merchantVOData.linkmanPhone"/>
        </el-form-item>
        <el-form-item label="联系人邮箱：" prop="linkmanEmail">
          <el-input :readonly="readonly" v-model="merchantVOData.linkmanEmail"/>
        </el-form-item>
        <el-form-item label="商户编号：" prop="merchantNumber">
          <el-input :readonly="true" v-model="merchantVOData.merchantNumber"/>
        </el-form-item>
        <el-form-item label="商户经营范围：" prop="merchantScope">
          <el-input :readonly="readonly" v-model="merchantVOData.merchantScope"/>
        </el-form-item>
        <el-form-item label="商户一级分类：" prop="firstCategory">
          <el-input :readonly="readonly" v-model="merchantVOData.firstCategory"/>
        </el-form-item>
        <el-form-item label="商户二级分类：" prop="secondCategory">
          <el-input :readonly="readonly" v-model="merchantVOData.secondCategory"/>
        </el-form-item>
        <el-form-item label="详细地址：" prop="address">
          <el-input :readonly="readonly" v-model="merchantVOData.address"/>
        </el-form-item>
        <el-form-item label="商户类型：" prop="merchantType">
          <el-select v-model="merchantVOData.merchantType" placeholder="请选择" disabled="disabled">
            <el-option label="请选择" value>请选择</el-option>
            <el-option label="批发商" value="1">批发商</el-option>
            <el-option label="零售商" value="2">零售商</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商户性质：" prop="merchantCharacter">
          <el-select
            v-model="merchantVOData.merchantCharacter"
            placeholder="请选择"
            disabled="disabled"
          >
            <el-option label="请选择" value>请选择</el-option>
            <el-option label="个人" value="1">个人</el-option>
            <el-option label="个体" value="2">个体</el-option>
            <el-option label="企业" value="3">企业</el-option>
          </el-select>
        </el-form-item>
        <div>
          <el-form-item label="省份：" prop="province">
            <el-select v-model="merchantVOData.province" placeholder="请选择" disabled="disabled">
              <el-option
                v-for="item in areaData"
                :label="item.name"
                :value="item.code"
                :key="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="市：" prop="city">
            <el-select v-model="merchantVOData.city" placeholder="请选择" disabled="disabled">
              <el-option
                v-for="item in areaCityData"
                :label="item.name"
                :value="item.code"
                :key="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="区县：" prop="county">
            <el-select v-model="merchantVOData.county" placeholder="请选择" disabled="disabled">
              <el-option
                v-for="item in areaCountyData"
                :label="item.name"
                :value="item.code"
                :key="item.id"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="clearfix">
          <span>商户资质</span>
        </div>
        <el-tabs v-if="enterpriseShow" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="营业执照" name="first">
            <div v-if="!tabsHide">
              <el-form-item label="营业执照编号：" prop="businessLicenseNo">
                <el-input :readonly="readonly" v-model="merchantVOData.businessLicenseNo"/>
              </el-form-item>
              <el-form-item label="税务登记证编号：" prop="taxCertificateNo">
                <el-input :readonly="readonly" v-model="merchantVOData.taxCertificateNo"/>
              </el-form-item>
              <el-form-item label="组织机构代码证：" prop="organCertificateNo">
                <el-input :readonly="readonly" v-model="merchantVOData.organCertificateNo"/>
              </el-form-item>
            </div>
            <div v-if="!tabsHide">
              <el-col :span="12">
                <el-form-item label="营业执照：" prop="businessLicenseUrl">
                  <el-upload
                    :limit="1"
                    :file-list="fileList"
                    :class="{disabled:uploadDisabled}"
                    :action="uploadImgUrl+'/base/image?type=MERCHANT_QUALIFICATION'"
                    list-type="picture-card"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="税务登记证：" prop="taxRegisterCertificateUrl">
                  <el-upload
                    :limit="1"
                    :file-list="taxRegisterCertificateUrlList"
                    :class="{disabled:uploadDisabled}"
                    :action="uploadImgUrl+'/base/image?type=MERCHANT_QUALIFICATION'"
                    list-type="picture-card"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="组织机构代码证：" prop="organCodeCertificateUrl">
                  <el-upload
                    :limit="1"
                    :file-list="organCodeCertificateUrlList"
                    :class="{disabled:uploadDisabled}"
                    :action="uploadImgUrl+'/base/image?type=MERCHANT_QUALIFICATION'"
                    list-type="picture-card"
                  />
                </el-form-item>
              </el-col>
            </div>
          </el-tab-pane>
          <el-tab-pane label="统一社会信用代码证" name="second">
            <el-form-item v-if="tabsHide" label="统一社会信用代码证号：" prop="unifiedCertificateNo">
              <el-input :readonly="readonly" v-model="merchantVOData.unifiedCertificateNo"/>
            </el-form-item>
            <div v-if="tabsHide">
              <el-col :span="12">
                <el-form-item label="统一社会信用代码证：" prop="unifiedCertificateUrl">
                  <el-upload
                    :file-list="unifiedCertificateUrlList"
                    :limit="1"
                    :class="{disabled:uploadDisabled}"
                    :action="uploadImgUrl+'/base/image?type=MERCHANT_QUALIFICATION'"
                    list-type="picture-card"
                  />
                </el-form-item>
              </el-col>
            </div>
          </el-tab-pane>
          <el-col :span="12">
            <el-form-item label="银行开户许可证：" prop="bankOrganUrl">
              <el-upload
                :limit="1"
                :file-list="bankOrganUrlList"
                :class="{disabled:uploadDisabled}"
                :action="uploadImgUrl+'/base/image?type=MERCHANT_QUALIFICATION'"
                list-type="picture-card"
              />
            </el-form-item>
          </el-col>
        </el-tabs>
        <el-form-item v-if="enterpriseShow" label="开户许可证编号：" prop="openCertificateNo">
          <el-input :readonly="readonly" v-model="merchantVOData.openCertificateNo"/>
        </el-form-item>
        <el-form-item label="法人姓名：" prop="legalPerson">
          <el-input :readonly="readonly" v-model="merchantVOData.legalPerson"/>
        </el-form-item>
        <el-form-item label="法人电话：" prop="legalPhone">
          <el-input :readonly="readonly" v-model="merchantVOData.legalPhone"/>
        </el-form-item>
        <el-form-item label="法人身份证号：" prop="legalIdCard">
          <el-input :readonly="readonly" v-model="merchantVOData.legalIdCard"/>
        </el-form-item>
        <el-form-item label="组织机构代码有效期至：" prop="organExpireEndDate">
          <el-date-picker
            v-model="merchantVOData.organExpireEndDate"
            type="date"
            placeholder="选择日期"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item label="组织机构代码证是否长期有效：" prop="organType">
          <el-select v-model="merchantVOData.organType" placeholder="请选择" disabled="disabled">
            <el-option
              v-for="item in organTypeData"
              :label="item.name"
              :value="item.code"
              :key="item.id"
            />
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="身份证正面：" prop="idCardFaceUrl">
              <el-upload
                :limit="1"
                :class="{disabled:uploadDisabled}"
                :file-list="idCardFaceUrlList"
                :action="uploadImgUrl+'/base/image?type=MERCHANT_QUALIFICATION'"
                list-type="picture-card"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证反面：" prop="idCardConUrl">
              <el-upload
                :limit="1"
                :file-list="idCardConUrlList"
                :class="{disabled:uploadDisabled}"
                :action="uploadImgUrl+'/base/image?type=MERCHANT_QUALIFICATION'"
                list-type="picture-card"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="经营场所门头照：" prop="storePhotoUrl">
              <el-upload
                :limit="1"
                :file-list="storePhotoUrlList"
                :class="{disabled:uploadDisabled}"
                :action="uploadImgUrl+'/base/image?type=MERCHANT_QUALIFICATION'"
                list-type="picture-card"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收银台场景照：" prop="scenePhoneUrl">
              <el-upload
                :limit="1"
                :file-list="scenePhoneUrlList"
                :class="{disabled:uploadDisabled}"
                :action="uploadImgUrl+'/base/image?type=MERCHANT_QUALIFICATION'"
                list-type="picture-card"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item v-if="!enterpriseShow" label="手持身份证：" prop="handIdCardUrl">
          <el-upload
            :limit="1"
            :file-list="handIdCardUrlList"
            :class="{disabled:uploadDisabled}"
            :action="uploadImgUrl+'/base/image?type=MERCHANT_QUALIFICATION'"
            list-type="picture-card"
          />
        </el-form-item>
        <div class="clearfix">
          <span>商户结算信息</span>
        </div>
        <el-form-item label="银行账户：" prop="bankCard">
          <el-input :readonly="readonly" v-model="merchantVOData.bankCard"/>
        </el-form-item>
        <el-form-item label="开户卡类型：" prop="bankCardType">
          <el-select v-model="merchantVOData.bankCardType" disabled="disabled" placeholder="请选择">
            <el-option label="未知" value="0">未知</el-option>
            <el-option label="对公" value="1">对公</el-option>
            <el-option label="对私" value="2">对私</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开户名：" prop="accountName">
          <el-input :readonly="readonly" v-model="merchantVOData.accountName"/>
        </el-form-item>
        <el-form-item label="开户银行总行：" prop="headBankName">
          <el-input
            :readonly="readonly"
            v-model="merchantVOData.headBankName"
            @input="changeInput"
          />
          <div v-if="showModel" class="ser-sel">
            <el-table :data="bankData" style="width: 100%">
              <el-table-column prop="bankName" width="180">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="alertBank(scope.$index, scope.row)"
                  >{{ scope.row.bankName }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
        <el-form-item label="开户银行省份：" prop="bankProvince">
          <el-select v-model="merchantVOData.bankProvince" placeholder="请选择" disabled="disabled">
            <el-option label="请选择" value>请选择</el-option>
            <el-option
              v-for="item in areaData"
              :label="item.name"
              :value="item.code"
              :key="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开户行城市：" prop="bankCity">
          <el-select v-model="merchantVOData.bankCity" placeholder="请选择" disabled="disabled">
            <el-option label="请选择" value>请选择</el-option>
            <el-option
              v-for="item in bankCityData"
              :label="item.name"
              :value="item.code"
              :key="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开户行支行：" prop="subBankName">
          <el-input
            :readonly="readonly"
            v-model="merchantVOData.subBankName"
            @input="selectedSubBankCode"
          />
          <div v-if="showModelSub" class="ser-sel">
            <el-table :data="smallBankData" style="width: 100%">
              <el-table-column prop="bankName" width="180">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="alertSubBank(scope.$index, scope.row)"
                  >{{ scope.row.bankName }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
        <el-form-item label="结算方式：" prop="settleType">
          <el-select v-model="merchantVOData.settleType" placeholder="请选择" disabled="disabled">
            <el-option label="请选择" value>请选择</el-option>
            <el-option label="自助结算" value="1">自助结算</el-option>
            <el-option label="手动结算" value="2">手动结算</el-option>
          </el-select>
        </el-form-item>
        <div v-if="!enterpriseShow">
          <el-form-item label="结算银行卡：" prop="settlementCardUrl">
            <el-upload
              :limit="1"
              :file-list="settlementCardUrlList"
              :class="{disabled:uploadDisabled}"
              :action="uploadImgUrl+'/base/image?type=MERCHANT_QUALIFICATION'"
              list-type="picture-card"
            />
          </el-form-item>
        </div>
        <div class="clearfix">
          <span>小程序信息</span>
        </div>
        <el-form-item label="小程序名称：" prop="appName">
          <el-input :readonly="readonly" v-model="merchantVOData.appName"/>
        </el-form-item>
        <el-form-item label="小程序APPID：" prop="appId">
          <el-input :readonly="readonly" v-model="merchantVOData.appId"/>
        </el-form-item>
        <el-form-item label="小程序秘钥：" prop="appSecret">
          <el-input :readonly="readonly" v-model="merchantVOData.appSecret"/>
        </el-form-item>
        <el-form-item label="平台编号：" prop="platAppId">
          <el-input :readonly="readonly" v-model="merchantVOData.platAppId"/>
        </el-form-item>
      </el-form>
    </div>
    <el-row class="submit-btn">
      <el-button type="primary" @click="eidthData()">子商户入网</el-button>
    </el-row>
  </div>
</template>
<script>
import {
  getHeadbankList,
  getMerchantRetail,
  getProvinceList,
  getCityChildList,
  getSmallbankList,
  getImgUrl
} from '@/api/merchant'
import { yeepaySubRegister } from '@/api/pay'
export default {
  data() {
    return {
      listLoading: false,
      uploadImgUrl: process.env.IMAGE_UPLOAD_API,
      readonly: true,
      activeName: 'first',
      // 校验规则
      rules: {
        appName: [
          { required: true, message: '小程序名称不能为空', trigger: 'blur' }
        ],
        appId: [
          { required: true, message: '小程序APPID不能为空', trigger: 'blur' }
        ],
        appSecret: [
          { required: true, message: '小程序秘钥不能为空', trigger: 'blur' }
        ],
        platAppId: [
          { required: true, message: '平台编号不能为空', trigger: 'blur' }
        ],
        linkman: [
          { required: true, message: '联系人不能为空', trigger: 'blur' }
        ],
        merchantName: [
          { required: true, message: '商户名称不能为空', trigger: 'blur' }
        ],
        merchantAbbre: [
          { required: true, message: '商户简介不能为空', trigger: 'blur' }
        ],
        linkmanPhone: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' }
        ],
        linkmanEmail: [
          { required: true, message: '联系人邮箱不能为空', trigger: 'blur' }
        ],
        merchantNumber: [
          { required: true, message: '商户编号不能为空', trigger: 'blur' }
        ],
        merchantScope: [
          { required: true, message: '商户经营范围不能为空', trigger: 'blur' }
        ],
        firstCategory: [
          { required: true, message: '商户一级分类不能为空', trigger: 'blur' }
        ],
        secondCategory: [
          { required: true, message: '商户二级分类不能为空', trigger: 'blur' }
        ],
        merchantType: [
          { required: true, message: '商户类型不能为空', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '详细地址不能为空', trigger: 'blur' }
        ],
        merchantCharacter: [
          { required: true, message: '商户性质不能为空', trigger: 'blur' }
        ],
        province: [
          { required: true, message: '基础信息省不能为空', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '基础信息市不能为空', trigger: 'blur' }
        ],
        county: [
          { required: true, message: '基础信息区不能为空', trigger: 'blur' }
        ],
        openCertificateNo: [
          { required: true, message: '开户许可证编号不能为空', trigger: 'blur' }
        ],
        legalPerson: [
          { required: true, message: '法人姓名不能为空', trigger: 'blur' }
        ],
        businessLicenseNo: [
          { required: true, message: '营业执照编号不能为空', trigger: 'blur' }
        ],
        legalPhone: [
          { required: true, message: '法人电话不能为空', trigger: 'blur' }
        ],
        legalIdCard: [
          { required: true, message: '法人身份证号不能为空', trigger: 'blur' }
        ],
        taxCertificateNo: [
          { required: true, message: '税务登记证编号不能为空', trigger: 'blur' }
        ],
        organCertificateNo: [
          { required: true, message: '组织机构代码证不能为空', trigger: 'blur' }
        ],
        unifiedCertificateNo: [
          {
            required: true,
            message: '统一社会信用代码证号不能为空',
            trigger: 'blur'
          }
        ],
        organExpireEndDate: [
          {
            required: true,
            message: '组织机构代码有效期至不能为空',
            trigger: 'blur'
          }
        ],
        organType: [
          {
            required: true,
            message: '组织机构代码证是否长期有效不能为空',
            trigger: 'blur'
          }
        ],
        bankCard: [
          { required: true, message: '银行账户不能为空', trigger: 'blur' }
        ],
        bankCardType: [
          { required: true, message: '开户卡类型不能为空', trigger: 'blur' }
        ],
        accountName: [
          { required: true, message: '开户名不能为空', trigger: 'blur' }
        ],
        headBankName: [
          { required: true, message: '开户银行总行不能为空', trigger: 'blur' }
        ],
        bankProvince: [
          { required: true, message: '开户银行省份不能为空', trigger: 'blur' }
        ],
        bankCity: [
          { required: true, message: '开户行城市不能为空', trigger: 'blur' }
        ],
        subBankName: [
          { required: true, message: '开户行支行不能为空', trigger: 'blur' }
        ],
        settleType: [
          { required: true, message: '结算方式不能为空', trigger: 'blur' }
        ],
        scenePhoneUrl: [
          { required: true, message: '收银台场景照不能为空', trigger: 'blur' }
        ],
        storePhotoUrl: [
          { required: true, message: '经营场所门头照不能为空', trigger: 'blur' }
        ],
        industryLicenseUrl: [
          { required: true, message: '行业许可证不能为空', trigger: 'blur' }
        ],
        settlementCardUrl: [
          { required: true, message: '结算银行卡不能为空', trigger: 'blur' }
        ],
        idCardFaceUrl: [
          { required: true, message: '身份证正面不能为空', trigger: 'blur' }
        ],
        idCardConUrl: [
          { required: true, message: '身份证反面不能为空', trigger: 'blur' }
        ],
        handIdCardUrl: [
          { required: true, message: '手持身份证不能为空', trigger: 'blur' }
        ],
        businessLicenseUrl: [
          { required: true, message: '营业执照不能为空', trigger: 'blur' }
        ],
        unifiedCertificateUrl: [
          {
            required: true,
            message: '统一社会信用代码证不能为空',
            trigger: 'blur'
          }
        ],
        taxRegisterCertificateUrl: [
          { required: true, message: '税务登记证不能为空', trigger: 'blur' }
        ],
        organCodeCertificateUrl: [
          { required: true, message: '组织机构代码证不能为空', trigger: 'blur' }
        ],
        bankOrganUrl: [
          { required: true, message: '银行开户许可证不能为空', trigger: 'blur' }
        ]
      },
      merchantNumber: '',
      showModel: false,
      showModelSub: false,
      formLabelWidth: '210px',
      param: '',
      listQuery: {
        pageNum: 1, // 页码
        pageSize: 50 // 每页数量
      },
      listCityQuery: {
        pageNum: 1,
        pageSize: 50
      },
      areaType: 'province',
      areaData: [],
      areaCityData: [],
      areaCountyData: [],
      bankData: [],
      bankCityData: [],
      smallBankData: [],
      organTypeData: [
        { code: true, name: '是', id: 1 },
        { code: false, name: '否', id: 2 }
      ],
      settleTypeData: [
        { code: 1, name: '自助结算', id: 1 },
        { code: 2, name: '手动结算', id: 2 }
      ],
      businessLicenseUrl: '',
      idCardFaceUrl: '',
      idCardConUrl: '',
      handIdCardUrl: '',
      unifiedCertificateUrl: '',
      taxRegisterCertificateUrl: '',
      organCodeCertificateUrl: '',
      bankOrganUrl: '',
      storePhotoUrl: '',
      scenePhoneUrl: '',
      industryLicenseUrl: '',
      settlementCardUrl: '',
      fileList: [],
      tabsHide: false,
      idCardFaceUrlList: [],
      idCardConUrlList: [],
      handIdCardUrlList: [],
      unifiedCertificateUrlList: [],
      taxRegisterCertificateUrlList: [],
      organCodeCertificateUrlList: [],
      bankOrganUrlList: [],
      storePhotoUrlList: [],
      scenePhoneUrlList: [],
      industryLicenseUrlList: [],
      settlementCardUrlList: [],
      enterpriseShow: true,
      merchantRetailId: '',
      merchantQualificationVOId: '',
      merchantSettleVOId: '',
      merchantVOData: {},
      onlinePayConfigShow: false
    }
  },
  created() {
    this.getParams()
    this.getProvinceListData()
  },
  methods: {
    uploadDisabled: function() {
      return this.imagelist.length > 0
    },
    // 选择城市
    getProvinceListData() {
      getProvinceList(this.listQuery).then(response => {
        this.areaData = response.data.obj.result
      })
    },
    getDataName(arr, event) {
      let obj = {}
      obj = arr.find(item => {
        return item.code === event
      })
      return obj.name
    },
    getBankCityData(listQuery) {
      getCityChildList(listQuery).then(response => {
        this.bankCityData = response.data.obj.result
      })
    },
    // getSmallbankListData(listQuery) {
    //   getSmallbankList(listQuery).then(response => {
    //     this.smallBankData = response.data.obj.result
    //   })
    // },
    empetySubData() {
      this.merchantVOData.subBankCode = ''
      this.merchantVOData.subBankName = ''
    },
    getDataNankName(arr, event) {
      let obj = {}
      obj = arr.find(item => {
        return item.bankCode === event
      })
      return obj.bankName
    },
    selectedSubBankCode() {
      const bankName = this.merchantVOData.subBankName
      const listQuery = this.listQuery
      listQuery.bankName = bankName
      listQuery.headBankCode = this.merchantVOData.headBankCode
      listQuery.provinceCode = this.merchantVOData.bankProvinceCode
      listQuery.cityCode = this.merchantVOData.cityCode
      getSmallbankList(listQuery).then(response => {
        this.smallBankData = response.data.obj.result
        this.showModelSub = true
      })
    },
    alertSubBank(index, row) {
      this.merchantVOData.subBankCode = row.bankCode
      this.merchantVOData.subBankName = row.bankName
      this.showModelSub = false
    },
    // 模糊搜索
    changeInput() {
      const bankName = this.merchantVOData.headBankName
      if (bankName) {
        this.listQuery.bankName = bankName
        getHeadbankList(this.listQuery).then(response => {
          this.bankData = response.data.obj.result
          this.showModel = true
        })
      }
    },
    alertBank(index, row) {
      this.merchantVOData.headBankCode = row.bankCode
      this.merchantVOData.headBankName = row.bankName
      this.empetySubData()
      this.showModel = false
    },
    // 切换个体。企业
    handleClick(tab, event) {
      if (tab._vnode.data.attrs.id === 'pane-second') {
        this.tabsHide = true
      } else {
        this.tabsHide = false
      }
    },
    merchantCharacter(event) {
      if (event === '3') {
        this.enterpriseShow = true
      } else {
        this.enterpriseShow = false
      }
      this.merchantVOData.merchantCharacter = event
    },
    getImageUrl(filePath, name) {
      const params = { filePath: filePath }
      getImgUrl(params).then(response => {
        const fileList = []
        fileList.push({ url: response.obj })
        if (name === 'businessLicenseUrl') {
          this.businessLicenseUrl = response.obj
          this.fileList = fileList
        }
        if (name === 'idCardFaceUrl') {
          this.idCardFaceUrl = response.obj
          this.idCardFaceUrlList = fileList
        }
        if (name === 'idCardConUrl') {
          this.idCardConUrl = response.obj
          this.idCardConUrlList = fileList
        }
        if (name === 'settlementCardUrl') {
          this.settlementCardUrl = response.obj
          this.settlementCardUrlList = fileList
        }
        if (name === 'unifiedCertificateUrl') {
          this.unifiedCertificateUrl = response.obj
          this.unifiedCertificateUrlList = fileList
        }
        if (name === 'taxRegisterCertificateUrl') {
          this.taxRegisterCertificateUrl = response.obj
          this.taxRegisterCertificateUrlList = fileList
        }
        if (name === 'organCodeCertificateUrl') {
          this.organCodeCertificateUrl = response.obj
          this.organCodeCertificateUrlList = fileList
        }
        if (name === 'bankOrganUrl') {
          this.bankOrganUrl = response.obj
          this.bankOrganUrlList = fileList
        }
        if (name === 'storePhotoUrl') {
          this.storePhotoUrl = response.obj
          this.storePhotoUrlList = fileList
        }
        if (name === 'scenePhoneUrl') {
          this.scenePhoneUrl = response.obj
          this.scenePhoneUrlList = fileList
        }
        if (name === 'industryLicenseUrl') {
          this.industryLicenseUrl = response.obj
          this.industryLicenseUrlList = fileList
        }
        if (name === 'handIdCardUrl') {
          this.handIdCardUrl = response.obj
          this.handIdCardUrlList = fileList
        }
      })
    },
    getParams() {
      const routerParams = this.$route.query.merchantNo
      getMerchantRetail(routerParams).then(response => {
        let obj = {}
        this.merchantRetailId = response.data.merchantVO.id
        obj = Object.assign(response.data.merchantVO, obj)
        if (response.data.merchantVO.merchantCharacter === '3') {
          this.enterpriseShow = true
        } else {
          this.enterpriseShow = false
        }
        if (response.data.merchantQualificationVO) {
          obj = Object.assign(response.data.merchantQualificationVO, obj)
          this.merchantQualificationVOId =
            response.data.merchantQualificationVO.id
          const imgUrl =
            response.data.merchantQualificationVO.businessLicenseUrl
          const idCardFaceUrl =
            response.data.merchantQualificationVO.idCardFaceUrl
          const idCardConUrl =
            response.data.merchantQualificationVO.idCardConUrl
          const handIdCardUrl =
            response.data.merchantQualificationVO.handIdCardUrl
          const unifiedCertificateUrl =
            response.data.merchantQualificationVO.unifiedCertificateUrl
          const taxRegisterCertificateUrl =
            response.data.merchantQualificationVO.taxRegisterCertificateUrl
          const organCodeCertificateUrl =
            response.data.merchantQualificationVO.organCodeCertificateUrl
          const bankOrganUrl =
            response.data.merchantQualificationVO.bankOrganUrl
          const storePhotoUrl =
            response.data.merchantQualificationVO.storePhotoUrl
          const scenePhoneUrl =
            response.data.merchantQualificationVO.scenePhoneUrl
          const industryLicenseUrl =
            response.data.merchantQualificationVO.industryLicenseUrl
          if (unifiedCertificateUrl) {
            this.getImageUrl(unifiedCertificateUrl, 'unifiedCertificateUrl')
          }
          if (taxRegisterCertificateUrl) {
            this.getImageUrl(
              taxRegisterCertificateUrl,
              'taxRegisterCertificateUrl'
            )
          }
          if (organCodeCertificateUrl) {
            this.getImageUrl(
              organCodeCertificateUrl,
              'organCodeCertificateUrl'
            )
          }
          if (bankOrganUrl) {
            this.getImageUrl(bankOrganUrl, 'bankOrganUrl')
          }
          if (storePhotoUrl) {
            this.getImageUrl(storePhotoUrl, 'storePhotoUrl')
          }
          if (scenePhoneUrl) {
            this.getImageUrl(scenePhoneUrl, 'scenePhoneUrl')
          }
          if (industryLicenseUrl) {
            this.getImageUrl(industryLicenseUrl, 'industryLicenseUrl')
          }
          if (imgUrl) {
            this.getImageUrl(imgUrl, 'businessLicenseUrl')
          }
          if (idCardFaceUrl) {
            this.getImageUrl(idCardFaceUrl, 'idCardFaceUrl')
          }
          if (idCardConUrl) {
            this.getImageUrl(idCardConUrl, 'idCardConUrl')
          }
          if (handIdCardUrl) {
            this.getImageUrl(handIdCardUrl, 'handIdCardUrl')
          }
        }
        if (response.data.merchantMiniprogramVO) {
          obj = Object.assign(response.data.merchantMiniprogramVO, obj)
        }
        if (response.data.merchantSettleVO) {
          this.merchantSettleVOId = response.data.merchantSettleVO.id
          obj = Object.assign(response.data.merchantSettleVO, obj)
          const settlementCardUrl =
            response.data.merchantSettleVO.settlementCardUrl
          if (settlementCardUrl) {
            this.getImageUrl(settlementCardUrl, 'settlementCardUrl')
          }
        }
        if (response.data.merchantOnlinePayConfigVO) {
          obj = Object.assign(response.data.merchantOnlinePayConfigVO, obj)
          this.onlinePayConfigShow = true
        }
        this.merchantVOData = obj
        this.merchantNumber = response.data.merchantNumber
      })
    },
    hideloadimg() {
      this.listLoading = false
    },
    eidthData() {
      const formData = this.merchantVOData
      this.listLoading = true
      this.$refs[formData].validate(valid => {
        if (valid) {
          let merchantStyle = ''
          if (formData.merchantCharacter === '1') {
            merchantStyle = 'gr'
          }
          if (formData.merchantCharacter === '2') {
            merchantStyle = 'qy'
          }
          if (formData.merchantCharacter === '3') {
            merchantStyle = 'gt'
          }
          // let bankCardType = ''
          // if (formData.bankCardType === '2') {
          //   bankCardType = 'private_cash'
          // }
          // if (formData.bankCardType === '1') {
          //   bankCardType = 'public_cash'
          // }
          // if (formData.bankCardType === '0') {
          //   this.$message.error('开户卡类型未知！')
          //   return
          // }
          if (this.onlinePayConfigShow) {
            if (formData.onlinePay) {
              const payProduct = formData.payProduct
              if (payProduct !== '小程序支付') {
                this.$message.error('请在商户资质管理补全信息！')
                this.hideloadimg()
                return
              }
            } else {
              this.$message.error('请开通支付！')
              this.hideloadimg()
              return
            }
          } else {
            this.$message.error('请不全支付配置！')
            this.hideloadimg()
            return
          }
          const data = {
            accLicenseNo: formData.openCertificateNo,
            address: formData.address,
            appName: formData.appName,
            bankBranchCode: formData.subBankName,
            bankCardAccName: formData.accountName,
            bankCardNo: formData.bankCard,
            bankCityCode: formData.bankCityCode,
            bankHeadCode: formData.headBankName,
            bankProvinceCode: formData.bankProvinceCode,
            businessLicenseNo: formData.businessLicenseNo,
            channel: 'yeepay',
            cityCode: formData.cityCode,
            contactPersonEmail: formData.linkmanEmail,
            contactPersonName: formData.linkman,
            contactPersonPhone: formData.linkmanPhone,
            districtCode: formData.countyCode,
            fullName: formData.merchantName,
            legalPersonId: formData.legalIdCard,
            legalPersonName: formData.legalPerson,
            merchantNumber: this.merchantNumber,
            merchantPictureInfoMap: {
              idcard_front: formData.idCardFaceUrl,
              idcard_back: formData.idCardConUrl,
              settle_bankcard: formData.settlementCardUrl,
              corp_code: formData.businessLicenseUrl
            },
            merchantScope: formData.merchantScope,
            merchantStyle: merchantStyle,
            oneCategory: formData.firstCategory,
            orgCertNo: formData.organCertificateNo,
            orgCertNoExpiry: formData.organExpireEndDate,
            orgCertNoLong: formData.organType,
            payProduct: formData.payProduct,
            payScenario: 'wechatminipro', // 暂时写死
            provinceCode: formData.provinceCode,
            shortName: formData.merchantAbbre,
            taxRegistCertNo: formData.taxCertificateNo,
            twoCategory: formData.secondCategory,
            uniCreditNo: formData.unifiedCertificateNo
          }
          yeepaySubRegister(data)
            .then(response => {
              const message = response.data.message
              const code = response.data.code
              if (code === '1') {
                this.$message({
                  message: message,
                  type: 'success'
                })
              } else {
                this.$message({
                  message: message,
                  type: 'success'
                })
                this.$router.push({
                  path: '/pay/yibaoBranchOnline'
                })
              }
              this.listLoading = false
            })
            .catch(response => {
              this.listLoading = false
              const message = response.data.message
              this.$message.error(message)
            })
        } else {
          this.listLoading = false
          this.$message.error('请在商户资质管理补全信息！')
        }
      })
    }
  }
}
</script>
<style>
.yb-lable .el-icon-arrow-up:before {
  content: "";
}
.yb-lable .el-input.is-disabled .el-input__inner {
  background: #fff;
  color: #333;
}
.yb-lable .disabled .el-upload--picture-card {
  display: none;
}
.yb-lable .el-upload-list--picture-card .el-upload-list__item-actions {
  position: unset;
  background: rgba(0, 0, 0, 0.1);
}
.yb-lable .el-form-item__label {
  padding: 0;
}
.yb-lable .el-form-item__error {
  min-width: 180px;
}
</style>
