<template lang="html">
    <section class="reportView">

        <!-- 报表tab切换 -->
        <div class="reTab">
            <div class="tab-cell" 
                :class="{cur: curTabRep.tabType === 'sale'}" 
                @click="changeReTab('sale')"><span class="txt">销量</span></div>
            <div class="tab-cell" 
                :class="{cur: curTabRep.tabType === 'income'}" 
                @click="changeReTab('income')"><span class="txt">收入</span></div>
            <div class="tab-cell" 
                :class="{cur: curTabRep.tabType === 'receivable'}"                
                @click="changeReTab('receivable')"><span class="txt">应收账款</span></div>
        </div>

        <!-- 组织名称 -->
        <div class="reUnit">
            <div class="unitTit flexWrap">
                <p class="flexHd">组织名称</p>
                <p class="unitSelect" @click="selectUnitFn" v-if="reportStore.unitMsg.apiData && reportStore.unitMsg.apiData.pianlians.length && reportStore.unitMsg.apiData.type != 4">选择对象</p>                
                <p class="unitSelect disabled" v-else>选择对象</p>
            </div>
            <div v-if="reportStore.unitMsg.selectedData">
                <p class="flexWrap" >{{reportStore.unitMsg.selectedData.pianlian.name}}</p>
                <p class="flexWrap">{{reportStore.unitMsg.selectedData.pianqu.name}}</p>
                <p class="flexWrap">{{reportStore.unitMsg.selectedData.company.name}}</p>
            </div>
            
            
        </div>

        <!-- 统计时间方式切换 -->
        <div class="reType" v-show="curTabRep.tabType !== 'receivable'">
            <div class="typeTab" >
                <div class="Typewrap">
                    <p class="typeItem"
                        :class="{cur: curTabRep.dateType === 'daliy'}"
                        @click="changeDateTab('daliy')"
                    >日统计</p>
                    <p class="typeItem"
                        :class="{cur: curTabRep.dateType === 'month'}"
                        @click="changeDateTab('month')"
                    >月统计</p>
                </div>
            </div>
            <!-- 选择时间 -->
            <div class="selectData flexWrap">
                <p class="flexHd">选择日期</p>
                <p class="unitSelect curDate" v-show="curTabRep.dateType === 'daliy'">{{curTabRep.selectedDate}}</p>
                <p class="unitSelect curYm" v-show="curTabRep.dateType === 'month'">{{curTabRep.selectedYm}}</p>                
            </div>
        </div>
        <!-- 销量 reDetail.curDetail-->
        <div class="reDetailW" :class="curTabRep.tabType">
            <!-- 应收账截至日期 -->
            <div class="detailItem" v-show="curTabRep.tabType === 'receivable'">
                <div class="topItem">
                    <p class="deHd">应收账款截至日期</p>
                    <p class="deRt">{{reDetail.curDetail.data.date | pareDate}}</p>
                </div>
            </div>

            <!-- 无二级 总计-->
            <div class="detailItem">
                <div class="topItem">
                    <p class="deHd" v-if="reDetail.curDetail.type === 'receivable'">应收账款总额</p>
                    <p class="deHd" v-else>{{reDetail.curDetail.data.name}}</p>                    
                    <p class="deRt" v-if="reDetail.curDetail.type === 'sale'">{{reDetail.curDetail.data.total | floatWe}}吨</p>
                    <p class="deRt" v-else-if="reDetail.curDetail.type === 'income'">{{reDetail.curDetail.data.totalMount |floatMoney}}万元</p>
                    <p class="deRt" v-else>
                        <span v-if= "!reDetail.curDetail.data.amount && reDetail.curDetail.data.amount !=0">暂无数据</span>
                        <span v-else>{{reDetail.curDetail.data.amount | floatMoney}}万元</span>
                    </p>                            
                </div>
            </div>

            <!-- 销量-->
            <div class="detailItem"                
                @click="openDetail(topItme.totalNum > 0 || topItme.totalMount > 0, key)"
                v-for="(topItme, key) in reDetail.curDetail.data"
                :class="[key, (key === curUpDetail && (topItme.totalNum > 0 || topItme.totalMount > 0)) ? 'hasChildD': '',(topItme.totalNum > 0 || topItme.totalMount > 0) ? 'hasChildR':'']"
                v-if="reDetail.curDetail.type === 'sale' && key!='name'&&key!='total'&& key!='totalMount'">
                <div class="topItem">
                    <p class="deHd">{{topItme.name}}</p>
                    <p class="deRt">{{topItme.totalNum | floatWe}}吨</p>
                </div>
                <!-- 二级 -->
                <div class="childItem"
                    v-if="_key !='name' && _key!='saleMount' && _key!='totalNum'"
                    v-for="(childItem, _key) in topItme">
                    <div class="childCell"                         
                        v-for="childDe in childItem">
                        <p class="deHd">{{childDe.name}}</p>
                        <p class="deRt">{{childDe.num | floatWe}}吨</p>
                    </div>
                                        
                </div>

            </div>
            <!-- 收入 明细 -->
            <div class="detailItem"
                @click="openDetail(topItme.totalNum > 0 || topItme.totalMount > 0, key)"
                :class="[key, (key === curUpDetail && (topItme.totalNum > 0 || topItme.totalMount > 0 ) )? 'hasChildD': '',(topItme.totalNum > 0 || topItme.totalMount > 0) ? 'hasChildR':'']"
                v-for="(topItme, key) in reDetail.curDetail.data" 
                v-if="reDetail.curDetail.type === 'income' && key!='name' && key!='total' && key!='totalMount'">
                <div class="topItem">
                    <p class="deHd">{{topItme.name}}</p>
                    <p class="deRt">{{topItme.saleMount | floatMoney}}万元</p>
                </div>
                <!-- 二级 -->
                <div class="childItem"
                    v-if="_key !='name' && _key!='saleMount' && _key!='totalNum'"
                    v-for="(childItem, _key) in topItme">
                    <div class="childCell"                         
                        v-for="childDe in childItem">
                        <p class="deHd">{{childDe.name}}</p>
                        <p class="deRt">{{childDe.mount | floatMoney}}万元</p>
                    </div>
                                        
                </div>

            </div>

            <!--应收账明细  -->
            <div class="detailItem"
                @click="confirmRecPick(topItme)"
                v-for="(topItme, key) in reDetail.curDetail.data.details" 
                v-if="reDetail.curDetail.type === 'receivable'">
                <div class="topItem">
                    <p class="deHd">{{topItme.name}}</p>
                    <p class="deRt">{{topItme.amount | floatMoney}}万元</p>
                </div>
                <!-- 二级 -->
                

            </div>

        </div>

        <!-- 选择对象 -->        
        <section class="selectUnit" v-if="isShowUnit">
            <!-- 根据所搜返回关键词 -->
            <div class="unitItem topSearch">
                <input class="searchIn" 
                    type="text" 
                    maxlength="50"
                    v-model ="inputSeach"
                    placeholder="选择公司/片区/片联">                 
            </div>
            <!-- 匹配的关键词 显示信息列表 -->
            <div class="matchKey" v-show="isShowSearch">
                <div class="unitItem" 
                    @click = "searchConfrim(matchPer)"
                    v-for="matchPer in pickMatchList">
                    <p class="itemName">{{matchPer.text}}</p>
                </div>
            </div>

            <!-- 滚动选择信息 -->
            <div class="showBPick" v-show="!isShowSearch">
                <!-- 接口对象返回操作type：1，所有可操作  -->
                <div v-if ="reportStore.unitMsg.apiData.type == '1'">
                    <div class="unitItem" @click="updatePicker('pianlians')">
                        <!-- <div class="itemTit">请选择片联</div> -->
                        <p class="itemName">{{reportStore.unitMsg.selectedData.pianlian.name || '请选择片联'}}</p>                    
                    </div>
                    <div class="unitItem" @click="updatePicker('pianqus')">
                        <!-- <div class="itemTit">请选择片区</div> -->
                        <p class="itemName">{{reportStore.unitMsg.selectedData.pianqu.name || '请选择片区'}}</p>
                    </div>
                    <div class="unitItem" @click="updatePicker('companys')">
                        <!-- <div class="itemTit">请选择公司</div> -->
                        <p class="itemName">{{reportStore.unitMsg.selectedData.company.name || '请选择公司'}}</p>
                    </div>
                </div>
                <!-- 接口对象返回操作type：2，仅片联不可操作  -->
                <div v-else-if ="reportStore.unitMsg.apiData.type == '2'">
                    <div class="unitItem disable">
                        <!-- <div class="itemTit">请选择片联</div> -->
                        <p class="itemName">{{reportStore.unitMsg.selectedData.pianlian.name || '请选择片联'}}</p>
                    </div>
                    <div class="unitItem" @click="updatePicker('pianqus')">
                        <!-- <div class="itemTit">请选择片区</div> -->
                        <p class="itemName">{{reportStore.unitMsg.selectedData.pianqu.name|| '请选择片区'}}</p>
                    </div>
                    <div class="unitItem" @click="updatePicker('companys')">
                        <!-- <div class="itemTit">请选择公司</div> -->
                        <p class="itemName">{{reportStore.unitMsg.selectedData.company.name || '请选择公司'}}</p>
                    </div>
                </div>           
                <!-- 接口对象返回操作type：3，仅公司可操作  -->
                <div v-else-if ="reportStore.unitMsg.apiData.type == '3'">
                    <div class="unitItem disable">
                        <!-- <div class="itemTit">请选择片联</div> -->
                        <p class="itemName">{{reportStore.unitMsg.selectedData.pianlian.name || '请选择片联'}}</p>
                    </div>
                    <div class="unitItem disable">
                        <!-- <div class="itemTit">请选择片区</div> -->
                        <p class="itemName">{{reportStore.unitMsg.selectedData.pianqu.name || '请选择片区'}}</p>
                    </div>
                    <div class="unitItem" @click="updatePicker('companys')">
                        <!-- <div class="itemTit">请选择公司</div> -->
                        <p class="itemName">{{reportStore.unitMsg.selectedData.company.name || '请选择公司'}}</p>
                    </div>
                </div>
                <!-- 接口对象返回操作type：4，都不可操作  -->
                <div v-else-if ="reportStore.unitMsg.apiData.type == '4'">
                    <div class="unitItem disable">
                        <!-- <div class="itemTit">请选择片联</div> -->
                        <p class="itemName">{{reportStore.unitMsg.selectedData.pianlian.name || '请选择片联'}}</p>
                    </div>
                    <div class="unitItem disable">
                        <!-- <div class="itemTit">请选择片区</div> -->
                        <p class="itemName">{{reportStore.unitMsg.selectedData.pianqu.name || '请选择公司'}}</p>
                    </div>
                    <div class="unitItem disable">
                        <!-- <div class="itemTit">请选择公司</div> -->
                        <p class="itemName">{{reportStore.unitMsg.selectedData.company.name || '请选择公司'}}</p>
                    </div>
                </div>  

                <!-- 确认按钮 -->
                <div class="selectBtn" @click="changetUnitFn">确定</div>
            </div>
            
        </section>

        <!-- 提示信息 -->
        <loading v-if="reportStore.loading" :text="loadingText" />
        <toast :message="toastMsg" />
        <alert :message="reportStore.error.message"
            :buttons="alertOpts.buttons"
            :left-btn="alertOpts.leftBtn"
            :right-btn="alertOpts.rightBtn"
            :single-btn="alertOpts.singleBtn" />
        <!-- 组织对象选择 -->
        <div class="pickerBox" v-show="showUnitPicker">
            <vue-pickers
            :show="showUnitPicker"
            :selectData="reportStore.unitMsg.curPickerData"
            v-on:cancel="closeUnitPick"
            v-on:confirm="confirmUnitPick"></vue-pickers>
        </div>
        

    </section>
</template>

<script src='./report.js' lang='babel'></script>
<style lang="stylus" src="./report.styl" scoped></style>

