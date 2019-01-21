<template>
  <div v-loading.body="listLoading" style="padding:30px;">
    <div class="block">
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
        <el-form-item label="商户名称" prop="merchantName">
          <el-input :readonly="readonly" v-model="merchantVOData.merchantName"/>
        </el-form-item>
        <el-form-item label="商户编号" prop="merchantNumber">
          <el-input :readonly="true" v-model="merchantVOData.merchantNumber"/>
        </el-form-item>
        <el-form-item label="商户简称" prop="merchantAbbre">
          <el-input :readonly="readonly" v-model="merchantVOData.merchantAbbre"/>
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input :readonly="readonly" v-model="merchantVOData.linkman"/>
        </el-form-item>
        <el-form-item label="联系电话" prop="linkmanPhone">
          <el-input :readonly="readonly" v-model="merchantVOData.linkmanPhone"/>
        </el-form-item>
        <el-form-item label="联系人邮箱">
          <el-input :readonly="readonly" v-model="merchantVOData.linkmanEmail"/>
        </el-form-item>
        <el-form-item label="商户经营范围">
          <el-input :readonly="readonly" v-model="merchantVOData.merchantScope"/>
        </el-form-item>
        <el-form-item label="商户一级分类">
          <el-input :readonly="readonly" v-model="merchantVOData.firstCategory"/>
        </el-form-item>
        <el-form-item label="商户二级分类">
          <el-input :readonly="readonly" v-model="merchantVOData.secondCategory"/>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input :readonly="readonly" v-model="merchantVOData.address"/>
        </el-form-item>
        <el-form-item label="商户类型" prop="merchantType">
          <el-select
            v-model="merchantVOData.merchantType"
            placeholder="请选择"
            @change="merchantType($event)"
          >
            <el-option label="请选择" value>请选择</el-option>
            <el-option label="批发商" value="1">批发商</el-option>
            <el-option label="零售商" value="2">零售商</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商户性质" prop="merchantCharacter">
          <el-select
            v-model="merchantVOData.merchantCharacter"
            placeholder="请选择"
            @change="merchantCharacter($event)"
          >
            <el-option label="企业" value="3">企业</el-option>
          </el-select>
        </el-form-item>
        <div>
          <el-form-item label="省份" prop="province">
            <el-select
              v-model="merchantVOData.province"
              placeholder="请选择"
              @change="onSelectedDrug($event)"
            >
              <el-option
                v-for="item in areaData"
                :label="item.name"
                :value="item.code"
                :key="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="市" prop="city">
            <el-select
              v-model="merchantVOData.city"
              placeholder="请选择"
              @change="onSelectedCity($event)"
            >
              <el-option
                v-for="item in areaCityData"
                :label="item.name"
                :value="item.code"
                :key="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="区县" prop="county">
            <el-select
              v-model="merchantVOData.county"
              placeholder="请选择"
              @change="onSelectedCounty($event)"
            >
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
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="营业执照" name="first"/>
          <el-tab-pane label="统一社会信用代码证" name="second"/>
        </el-tabs>
        <el-form-item v-if="!tabsHide" label="营业执照编号" prop="businessLicenseNo">
          <el-input :readonly="readonly" v-model="merchantVOData.businessLicenseNo"/>
        </el-form-item>
        <el-form-item v-if="!tabsHide" label="税务登记证编号" prop="taxCertificateNo">
          <el-input :readonly="readonly" v-model="merchantVOData.taxCertificateNo"/>
        </el-form-item>
        <el-form-item v-if="!tabsHide" label="组织机构代码证" prop="organCertificateNo">
          <el-input :readonly="readonly" v-model="merchantVOData.organCertificateNo"/>
        </el-form-item>
        <el-form-item v-if="!tabsHide" label="组织机构代码有效期至" prop="organExpireEndDate">
          <el-date-picker
            v-model="merchantVOData.organExpireEndDate"
            type="date"
            placeholder="选择日期"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item v-if="!tabsHide" label="组织机构代码证是否长期有效" prop="organType">
          <el-select
            v-model="merchantVOData.organType"
            placeholder="请选择"
            @change="organTypeDataFun($event)"
          >
            <el-option
              v-for="item in organTypeData"
              :label="item.name"
              :value="item.code"
              :key="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开户许可证编号" prop="openCertificateNo">
          <el-input :readonly="readonly" v-model="merchantVOData.openCertificateNo"/>
        </el-form-item>
        <el-form-item label="法人姓名" prop="legalPerson">
          <el-input :readonly="readonly" v-model="merchantVOData.legalPerson"/>
        </el-form-item>
        <el-form-item label="法人电话" prop="legalPhone">
          <el-input :readonly="readonly" v-model="merchantVOData.legalPhone"/>
        </el-form-item>
        <el-form-item label="法人身份证号" prop="legalIdCard">
          <el-input :readonly="readonly" v-model="merchantVOData.legalIdCard"/>
        </el-form-item>
        <div v-if="!tabsHide">
          <el-col :span="12">
            <el-form-item label="营业执照" prop="businessLicenseUrl">
              <el-upload
                :on-remove="handleRemoveSuccess"
                :limit="1"
                :class="{disabled:fileListShow}"
                :file-list="fileList"
                :on-preview="handlePictureCardPreview"
                :on-success="handleSuccess"
                :action="uploadImgUrl+'/base/image?type=MERCHANT_QUALIFICATION'"
                list-type="picture-card"
              >
                <i class="el-icon-plus avatar-uploader-icon"/>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img :src="businessLicenseUrl" width="100%" alt>
              </el-dialog>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="税务登记证" prop="taxRegisterCertificateUrl">
              <el-upload
                :on-remove="handleRemovePreview"
                :limit="1"
                :class="{disabled:taxRegisterCertificateUrlListShow}"
                :file-list="taxRegisterCertificateUrlList"
                :on-preview="handlePictureCardPreview1"
                :on-success="handleSuccessRegister"
                :action="uploadImgUrl+'/base/image?type=MERCHANT_QUALIFICATION'"
                list-type="picture-card"
              >
                <i class="el-icon-plus avatar-uploader-icon"/>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible1">
                <img :src="taxRegisterCertificateUrl" width="100%" alt>
              </el-dialog>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组织机构代码证" prop="organCodeCertificateUrl">
              <el-upload
                :on-remove="handleRemoveOrgan"
                :limit="1"
                :file-list="organCodeCertificateUrlList"
                :on-preview="handlePictureCardPreview2"
                :class="{disabled:organCodeCertificateUrlListShow}"
                :on-success="handleSuccessOrgan"
                :action="uploadImgUrl+'/base/image?type=MERCHANT_QUALIFICATION'"
                list-type="picture-card"
              >
                <i class="el-icon-plus avatar-uploader-icon"/>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible2">
                <img :src="organCodeCertificateUrl" width="100%" alt>
              </el-dialog>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="银行开户许可证" prop="bankOrganUrl">
              <el-upload
                :on-remove="handleRemovePictureCard"
                :limit="1"
                :class="{disabled:bankOrganUrlListShow}"
                :on-preview="handlePictureCardPreview3"
                :file-list="bankOrganUrlList"
                :on-success="handleSuccessBank"
                :action="uploadImgUrl+'/base/image?type=MERCHANT_QUALIFICATION'"
                list-type="picture-card"
              >
                <i class="el-icon-plus avatar-uploader-icon"/>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible3">
                <img :src="bankOrganUrl" width="100%" alt>
              </el-dialog>
            </el-form-item>
          </el-col>
        </div>
        <el-form-item v-if="tabsHide" label="统一社会信用代码证号" prop="unifiedCertificateNo">
          <el-input :readonly="readonly" v-model="merchantVOData.unifiedCertificateNo"/>
        </el-form-item>
        <div v-if="tabsHide">
          <el-col :span="12">
            <el-form-item label="统一社会信用代码证" prop="unifiedCertificateUrl">
              <el-upload
                :on-remove="handleRemoveCertificate"
                :file-list="unifiedCertificateUrlList"
                :limit="1"
                :class="{disabled:unifiedCertificateUrlListShow}"
                :on-preview="handlePictureCardPreview4"
                :on-success="handleSuccessCertificate"
                :action="uploadImgUrl+'/base/image?type=MERCHANT_QUALIFICATION'"
                list-type="picture-card"
              >
                <i class="el-icon-plus avatar-uploader-icon"/>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible4">
                <img :src="unifiedCertificateUrl" width="100%" alt>
              </el-dialog>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="银行开户许可证" prop="bankOrganUrl">
              <el-upload
                :on-remove="handleRemovePictureCard"
                :limit="1"
                :class="{disabled:bankOrganUrlListShow}"
                :file-list="bankOrganUrlList"
                :on-preview="handlePictureCardPreview5"
                :on-success="handleSuccessBank"
                :action="uploadImgUrl+'/base/image?type=MERCHANT_QUALIFICATION'"
                list-type="picture-card"
              >
                <i class="el-icon-plus avatar-uploader-icon"/>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible5">
                <img :src="bankOrganUrl" width="100%" alt>
              </el-dialog>
            </el-form-item>
          </el-col>
        </div>
        <el-col :span="12">
          <el-form-item label="身份证正面" prop="idCardFaceUrl">
            <el-upload
              :on-remove="handleRemove"
              :limit="1"
              :class="{disabled:idCardFaceUrlListShow}"
              :on-preview="handlePictureCardPreview6"
              :file-list="idCardFaceUrlList"
              :on-success="handleSuccessFace"
              :action="uploadImgUrl+'/base/image?type=MERCHANT_QUALIFICATION'"
              list-type="picture-card"
            >
              <i class="el-icon-plus avatar-uploader-icon"/>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible6">
              <img :src="idCardFaceUrl" width="100%" alt>
            </el-dialog>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证反面" prop="idCardConUrl">
            <el-upload
              :on-remove="handleRemovePreviewidCardConUrl"
              :limit="1"
              :file-list="idCardConUrlList"
              :class="{disabled:idCardConUrlListShow}"
              :on-preview="handlePictureCardPreview7"
              :on-success="handleSuccessFaceCon"
              :action="uploadImgUrl+'/base/image?type=MERCHANT_QUALIFICATION'"
              list-type="picture-card"
            >
              <i class="el-icon-plus avatar-uploader-icon"/>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible7">
              <img :src="idCardConUrl" width="100%" alt>
            </el-dialog>
          </el-form-item>
        </el-col>
        <el-form-item/>
        <div class="clearfix">
          <span>商户结算信息</span>
        </div>
        <el-form-item label="银行账户" prop="bankCard">
          <el-input :readonly="readonly" v-model="merchantVOData.bankCard"/>
        </el-form-item>
        <el-form-item label="开户卡类型" prop="bankCardType">
          <el-select
            v-model="merchantVOData.bankCardType"
            placeholder="请选择"
            @change="bankCardTypeFun($event)"
          >
            <el-option label="未知" value="0">未知</el-option>
            <el-option label="对公" value="1">对公</el-option>
            <el-option label="对私" value="2">对私</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开户名" prop="accountName">
          <el-input :readonly="readonly" v-model="merchantVOData.accountName"/>
        </el-form-item>
        <el-form-item label="开户银行总行" prop="headBankName">
          <el-input
            :readonly="readonly"
            v-model="merchantVOData.headBankName"
            @input="changeInput"
          />
          <div v-if="showModel" class="ser-sel ser-sel-z">
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
        <el-form-item label="开户银行省份" prop="bankProvince">
          <el-select
            v-model="merchantVOData.bankProvince"
            placeholder="请选择"
            @change="onSelectedBank($event)"
          >
            <el-option label="请选择" value>请选择</el-option>
            <el-option
              v-for="item in areaData"
              :label="item.name"
              :value="item.code"
              :key="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开户行城市" prop="bankCity">
          <el-select
            v-model="merchantVOData.bankCity"
            placeholder="请选择"
            @change="onSelectedCityBank($event)"
          >
            <el-option label="请选择" value>请选择</el-option>
            <el-option
              v-for="item in bankCityData"
              :label="item.name"
              :value="item.code"
              :key="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开户行支行">
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
        <!-- <el-form-item label="结算方式" prop="settleType">
          <el-select
            v-model="merchantVOData.settleType"
            placeholder="请选择"
            @change="settleTypeFun($event)"
          >
            <el-option label="请选择" value>请选择</el-option>
            <el-option label="自助结算" value="1">自助结算</el-option>
            <el-option label="手动结算" value="2">手动结算</el-option>
          </el-select>
        </el-form-item>-->
      </el-form>
    </div>
    <el-row class="submit-btn">
      <el-button type="primary" @click="eidthData()">确定</el-button>
    </el-row>
  </div>
</template>
<script>
import {
  getHeadbankList,
  getMerchantRetail,
  editMerchantRetail,
  getProvinceList,
  getCityChildList,
  getSmallbankList,
  getImgUrl
} from '@/api/merchant'
export default {
  data() {
    return {
      listLoading: false,
      privateImageUrl: this.Const.privateImageUrl,
      uploadImgUrl: process.env.IMAGE_UPLOAD_API,
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      dialogVisible4: false,
      dialogVisible5: false,
      dialogVisible6: false,
      dialogVisible7: false,
      readonly: false,
      tabsHide: false,
      merchantRetailId: '',
      merchantQualificationVOId: '',
      merchantSettleVOId: '',
      activeName: 'first',
      // 校验规则
      rules: {
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
        merchantNumber: [
          { required: true, message: '商户编号不能为空', trigger: 'blur' }
        ],
        merchantType: [
          { required: true, message: '商户类型不能为空', trigger: 'blur' }
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
        settleType: [
          { required: true, message: '结算方式不能为空', trigger: 'blur' }
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
      // settleTypeData: [
      //   { code: 1, name: '自助结算', id: 1 },
      //   { code: 2, name: '手动结算', id: 2 }
      // ],
      businessLicenseUrl: '',
      idCardFaceUrl: '',
      idCardConUrl: '',
      unifiedCertificateUrl: '',
      taxRegisterCertificateUrl: '',
      organCodeCertificateUrl: '',
      bankOrganUrl: '',
      settlementCardUrl: '',
      fileList: [],
      idCardFaceUrlList: [],
      idCardConUrlList: [],
      merchantVOData: {},
      unifiedCertificateUrlList: [],
      taxRegisterCertificateUrlList: [],
      organCodeCertificateUrlList: [],
      bankOrganUrlList: [],
      settlementCardUrlList: [],
      enterpriseShow: true,
      showModelSub: false,
      fileListShow: false,
      taxRegisterCertificateUrlListShow: false,
      organCodeCertificateUrlListShow: false,
      bankOrganUrlListShow: false,
      unifiedCertificateUrlListShow: false,
      idCardFaceUrlListShow: false,
      idCardConUrlListShow: false
    }
  },
  created() {
    this.getParams()
    this.getProvinceListData()
  },
  methods: {
    organTypeDataFun(event) {
      this.merchantVOData.organType = event
    },
    // settleTypeFun(event) {
    //   this.merchantVOData.settleType = event
    // },
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
    onSelectedDrug(event) {
      const name = this.getDataName(this.areaData, event)
      const listQuery = this.listQuery
      listQuery.parentCode = event
      this.merchantVOData.provinceCode = event
      this.merchantVOData.province = name
      this.merchantVOData.city = ''
      this.merchantVOData.cityCode = ''
      this.merchantVOData.county = ''
      this.merchantVOData.countyCode = ''
      getCityChildList(this.listQuery).then(response => {
        this.areaCityData = response.data.obj.result
      })
    },
    onSelectedCity(event) {
      const name = this.getDataName(this.areaCityData, event)
      const listQuery = this.listQuery
      listQuery.parentCode = event
      this.merchantVOData.cityCode = event
      this.merchantVOData.city = name
      getCityChildList(listQuery).then(response => {
        this.areaCountyData = response.data.obj.result
      })
    },
    onSelectedCounty(event) {
      const name = this.getDataName(this.areaCountyData, event)
      this.merchantVOData.countyCode = event
      this.merchantVOData.county = name
    },
    getBankCityData(listQuery) {
      getCityChildList(listQuery).then(response => {
        this.bankCityData = response.data.obj.result
      })
    },
    onSelectedBank(event) {
      const name = this.getDataName(this.areaData, event)
      this.merchantVOData.bankProvinceCode = event
      this.merchantVOData.bankProvince = name
      // this.merchantVOData.bankCityCode = "";
      // this.merchantVOData.bankCity = "";
      this.empetySubData()
      const listQuery = this.listQuery
      listQuery.parentCode = event
      this.getBankCityData(listQuery)
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
    onSelectedCityBank(event) {
      const name = this.getDataName(this.bankCityData, event)
      this.merchantVOData.bankCityCode = event
      this.merchantVOData.bankCity = name
      // const provinceCode = this.merchantSettleVO.bankProvinceCode
      // const listQuery = this.listQuery
      // listQuery.headBankCode = this.merchantSettleVO.headBankCode
      // listQuery.provinceCode = provinceCode
      // listQuery.cityCode = event
      // this.getSmallbankListData(listQuery)
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
      listQuery.cityCode = this.merchantVOData.bankCityCode
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
    alertBank(index, row) {
      this.merchantVOData.headBankCode = row.bankCode
      this.merchantVOData.headBankName = row.bankName
      this.empetySubData()
      this.showModel = false
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
    // 商户性质
    merchantType(event) {
      this.merchantVOData.merchantType = event
    },
    bankCardTypeFun(event) {
      this.merchantVOData.bankCardType = event
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
      this.merchantVOData.merchantCharacter = event
    },
    // 查看图片
    handlePictureCardPreview(file) {
      this.businessLicenseUrl = file.url
      this.dialogVisible = true
    },
    handlePictureCardPreview1(file) {
      this.taxRegisterCertificateUrl = file.url
      this.dialogVisible1 = true
    },
    handlePictureCardPreview2(file) {
      this.organCodeCertificateUrl = file.url
      this.dialogVisible2 = true
    },
    handlePictureCardPreview3(file) {
      this.bankOrganUrl = file.url
      this.dialogVisible3 = true
    },
    handlePictureCardPreview4(file) {
      this.unifiedCertificateUrl = file.url
      this.dialogVisible4 = true
    },
    handlePictureCardPreview5(file) {
      this.bankOrganUrl = file.url
      this.dialogVisible5 = true
    },
    handlePictureCardPreview6(file) {
      this.idCardFaceUrl = file.url
      this.dialogVisible6 = true
    },
    handlePictureCardPreview7(file) {
      this.idCardConUrl = file.url
      this.dialogVisible7 = true
    },
    // 删除图片
    handleRemove(file, fileList) {
      this.merchantVOData.idCardFaceUrl = ''
      this.idCardFaceUrlListShow = false
    },
    handleRemovePreviewidCardConUrl(file, fileList) {
      this.merchantVOData.idCardConUrl = ''
      this.idCardConUrlListShow = false
    },
    handleRemoveSuccess(file, fileList) {
      this.merchantVOData.businessLicenseUrl = ''
      this.fileListShow = false
    },
    handleRemoveCertificate(file, fileList) {
      this.merchantVOData.unifiedCertificateUrl = ''
      this.unifiedCertificateUrlListShow = false
    },
    handleRemovePreview(file, fileList) {
      this.merchantVOData.taxRegisterCertificateUrl = ''
      this.taxRegisterCertificateUrlListShow = false
    },
    handleRemoveOrgan(file, fileList) {
      this.merchantVOData.organCodeCertificateUrl = ''
      this.organCodeCertificateUrlListShow = false
    },
    handleRemovePictureCard(file, fileList) {
      this.merchantVOData.bankOrganUrl = ''
      this.bankOrganUrlListShow = false
    },
    handleRemoveSettlement(file, fileList) {
      this.merchantVOData.settlementCardUrl = ''
      this.settlementCardUrlListShow = false
    },
    // 图片上传
    handleSuccess(response) {
      const imgUrl = response.obj
      this.merchantVOData.businessLicenseUrl = imgUrl
      this.businessLicenseUrlListShow = true
    },
    handleSuccessFace(response) {
      const imgUrl = response.obj
      this.merchantVOData.idCardFaceUrl = imgUrl
      this.idCardFaceUrlListShow = true
    },
    handleSuccessFaceCon(response) {
      const imgUrl = response.obj
      this.merchantVOData.idCardConUrl = imgUrl
      this.idCardConUrlListShow = true
    },
    handleSuccessCertificate(response) {
      const imgUrl = response.obj
      this.merchantVOData.unifiedCertificateUrl = imgUrl
      this.unifiedCertificateUrlListShow = true
    },
    handleSuccessRegister(response) {
      const imgUrl = response.obj
      this.merchantVOData.taxRegisterCertificateUrl = imgUrl
      this.taxRegisterCertificateUrlListShow = true
    },
    handleSuccessOrgan(response) {
      const imgUrl = response.obj
      this.merchantVOData.organCodeCertificateUrl = imgUrl
      this.organCodeCertificateUrlListShow = true
    },
    handleSuccessBank(response) {
      const imgUrl = response.obj
      this.merchantVOData.bankOrganUrl = imgUrl
      this.bankOrganUrlListShow = true
    },
    handleSuccesSettlement(response) {
      const imgUrl = response.obj
      this.merchantVOData.settlementCardUrl = imgUrl
      this.settlementCardUrlListShow = true
    },
    getImageUrl(filePath, name) {
      const params = { filePath: filePath }
      getImgUrl(params).then(response => {
        const fileList = []
        var objResUrl = this.privateImageUrl + response.obj
        fileList.push({ url: response.obj })
        if (name === 'businessLicenseUrl') {
          this.businessLicenseUrl = objResUrl
          this.fileList = fileList
          this.fileListShow = true
        }
        if (name === 'idCardFaceUrl') {
          this.idCardFaceUrl = objResUrl
          this.idCardFaceUrlList = fileList
          this.idCardFaceUrlListShow = true
        }
        if (name === 'idCardConUrl') {
          this.idCardConUrl = objResUrl
          this.idCardConUrlList = fileList
          this.idCardConUrlListShow = true
        }
        if (name === 'settlementCardUrl') {
          this.settlementCardUrl = objResUrl
          this.settlementCardUrlList = fileList
          this.settlementCardUrlListShow = true
        }
        if (name === 'unifiedCertificateUrl') {
          this.unifiedCertificateUrl = objResUrl
          this.unifiedCertificateUrlList = fileList
          this.unifiedCertificateUrlListShow = true
        }
        if (name === 'taxRegisterCertificateUrl') {
          this.taxRegisterCertificateUrl = objResUrl
          this.taxRegisterCertificateUrlList = fileList
          this.taxRegisterCertificateUrlListShow = true
        }
        if (name === 'organCodeCertificateUrl') {
          this.organCodeCertificateUrl = objResUrl
          this.organCodeCertificateUrlList = fileList
          this.organCodeCertificateUrlListShow = true
        }
        if (name === 'bankOrganUrl') {
          this.bankOrganUrl = objResUrl
          this.bankOrganUrlList = fileList
          this.bankOrganUrlListShow = true
        }
      })
    },
    getParams() {
      const routerParams = this.$route.query.merchantNo
      getMerchantRetail(routerParams).then(response => {
        let obj = {}
        this.merchantRetailId = response.data.merchantVO.id
        obj = Object.assign(response.data.merchantVO, obj)
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
          const unifiedCertificateUrl =
            response.data.merchantQualificationVO.unifiedCertificateUrl
          const taxRegisterCertificateUrl =
            response.data.merchantQualificationVO.taxRegisterCertificateUrl
          const organCodeCertificateUrl =
            response.data.merchantQualificationVO.organCodeCertificateUrl
          const bankOrganUrl =
            response.data.merchantQualificationVO.bankOrganUrl
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
          if (imgUrl) {
            this.getImageUrl(imgUrl, 'businessLicenseUrl')
          }
          if (idCardFaceUrl) {
            this.getImageUrl(idCardFaceUrl, 'idCardFaceUrl')
          }
          if (idCardConUrl) {
            this.getImageUrl(idCardConUrl, 'idCardConUrl')
          }
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
        this.merchantVOData = obj
        this.merchantNumber = response.data.merchantNumber
      })
    },
    eidthData() {
      const formData1 = this.merchantVOData
      this.$refs[formData1].validate(valid => {
        if (valid) {
          this.listLoading = true
          const merchantQualificationVO = {
            id: this.merchantQualificationVOId,
            bankOrganUrl: formData1.bankOrganUrl,
            businessLicenseNo: formData1.businessLicenseNo,
            businessLicenseUrl: formData1.businessLicenseUrl,
            handIdCardUrl: formData1.handIdCardUrl,
            idCardConUrl: formData1.idCardConUrl,
            idCardFaceUrl: formData1.idCardFaceUrl,
            industryLicenseUrl: formData1.industryLicenseUrl,
            legalIdCard: formData1.legalIdCard,
            legalPerson: formData1.legalPerson,
            legalPhone: formData1.legalPhone,
            openCertificateNo: formData1.openCertificateNo,
            organCertificateNo: formData1.organCertificateNo,
            organCodeCertificateUrl: formData1.organCodeCertificateUrl,
            organType: formData1.organType,
            scenePhoneUrl: formData1.scenePhoneUrl,
            organExpireEndDate: formData1.organExpireEndDate,
            storePhotoUrl: formData1.storePhotoUrl,
            taxCertificateNo: formData1.taxCertificateNo,
            taxRegisterCertificateUrl: formData1.taxRegisterCertificateUrl,
            unifiedCertificateNo: formData1.unifiedCertificateNo,
            unifiedCertificateUrl: formData1.unifiedCertificateUrl
          }
          const merchantSettleVO = {
            id: this.merchantSettleVOId,
            merchantNumber: this.merchantNumber,
            accountName: formData1.accountName,
            bankCard: formData1.bankCard,
            bankCardType: formData1.bankCardType,
            bankCity: formData1.bankCity,
            bankCityCode: formData1.bankCityCode,
            bankProvince: formData1.bankProvince,
            bankProvinceCode: formData1.bankProvinceCode,
            headBankCode: formData1.headBankCode,
            headBankName: formData1.headBankName,
            settleType: formData1.settleType,
            settlementCardUrl: formData1.settlementCardUrl,
            subBankCode: formData1.subBankCode,
            subBankName: formData1.subBankName
          }

          const merchantRetail = {
            id: this.merchantRetailId,
            merchantNumber: this.merchantNumber,
            address: formData1.address,
            city: formData1.city,
            completionStatus: formData1.completionStatus,
            county: formData1.county,
            countyCode: formData1.countyCode,
            firstCategory: formData1.firstCategory,
            linkman: formData1.linkman,
            isDel: false,
            linkmanEmail: formData1.linkmanEmail,
            linkmanPhone: formData1.linkmanPhone,
            merchantAbbre: formData1.merchantAbbre,
            merchantCharacter: formData1.merchantCharacter,
            merchantName: formData1.merchantName,
            merchantScope: formData1.merchantScope,
            merchantType: formData1.merchantType,
            province: formData1.province,
            provinceCode: formData1.provinceCode,
            secondCategory: formData1.secondCategory
          }
          const merchantDetail = {
            merchantNumber: this.merchantNumber,
            merchantQualificationVO: merchantQualificationVO,
            merchantSettleVO: merchantSettleVO,
            merchantVO: merchantRetail
          }
          editMerchantRetail(merchantDetail)
            .then(response => {
              const message = response.data.message
              const code = response.data.code
              if (code === '0') {
                this.$message({
                  message: message,
                  type: 'success'
                })
                this.$router.push({
                  path: '/qualificationsManage/index'
                })
              } else {
                this.$message.error(message)
              }
              this.listLoading = false
            })
            .catch(response => {
              this.$message.error('修改失败！')
            })
        } else {
          this.$message.error('请补全信息！')
        }
      })
    }
  }
}
</script>
