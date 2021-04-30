<template>
    <el-container>
        <el-dialog :visible.sync="showInsert" :close-on-click-modal="false" :title="insertOrUpdate" :before-close="closeInsert">
            <el-dialog :visible.sync="showInsertNotice" :close-on-click-modal="false" append-to-body width="30%">
                <p>{{field}}不能为空</p>
                <el-button @click="showInsertNotice = false">确定</el-button>
            </el-dialog>
            <el-form ref="form" :model="form">
                <el-form-item label="名称" :label-width="insertLabelWidth">
                    <el-input v-model="form.testName"></el-input>
                </el-form-item>
                <el-form-item label="内容" :label-width="insertLabelWidth">
                    <el-input v-model="form.content"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button-group>
                        <el-button type="primary" @click="insertData">确认</el-button>
                        <el-button @click="closeInsert">取消</el-button>
                    </el-button-group>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-header>
            <el-container>
                <el-page-header @back="goBack()" content="test界面">
                </el-page-header>
            </el-container>
        </el-header>
        <el-container>
            <el-header width="200px">
                <el-row :gutter="20">
                    <el-form ref="form" :inline="true" :model="queryForm" :span="24">
                        <el-form-item label="名称">
                            <el-input v-model="queryForm.testName"></el-input>
                        </el-form-item>
                        <el-form-item label="内容">
                            <el-input v-model="queryForm.content"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button-group>
                                <el-button :loading="selectIsLoading" type="primary" @click="select">查询</el-button>
                                <el-button @click="insert">添加</el-button>
                                <el-button type="success" @click="updateById(null)">修改</el-button>
                            </el-button-group>
                        </el-form-item>
                    </el-form>
                </el-row>
            </el-header>
            <el-main>
                <el-table :data="privateTests"
                          stripe
                          highlight-current-row
                          @current-change="selectRow"
                          height="400"
                          style="width: 100%; text-align: center">
                    <el-table-column key="1" type="index">
                    </el-table-column>
                    <el-table-column key="2" prop="testName" label="名称" sortable>
                    </el-table-column>
                    <el-table-column key="3" prop="content" label="内容" sortable width="900px">
                    </el-table-column>
                    <el-table-column key="4" label="操作">
                        <template slot-scope="scope">
                            <el-button-group>
                                <el-button @click="updateById(scope.row)" type="success">编辑</el-button>
                                <el-button @click="deleteById(scope.row.id)" type="danger">删除</el-button>
                            </el-button-group>
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import axios from '@/utils/axios'

    export default {
        name: "private-self",
        data() {
            return {
                privateTests: [],
                tableLabel: [
                    {label: '序号', prop: 'id'},
                    {label: '名称', prop: 'testName'},
                    {label: '内容', prop: 'content'},
                ],
                isLoading: false,
                selectIsLoading: false,
                form: {},
                queryForm: {},
                showInsert: false,
                showInsertNotice: false,
                field: '',
                queryId: '',
                queryTestName: '',
                insertLabelWidth: '50px',
                selectedRow: {},
                insertOrUpdate: '添加'
            }
        },
        created() {
            this.selectAll();
        },
        methods: {
            selectAll: function () {
                var that = this;
                that.selectIsLoading = true;
                axios.get('/selectAll'
                ).then(function (data) {
                    that.privateTests = data.data
                    that.selectIsLoading = false
                })
            },
            select: function () {
                var that = this;
                axios.post('/select', that.queryForm
                ).then(function (data) {
                    that.privateTests = data.data
                    that.selectIsLoading = false
                })
            },
            insert: function () {
                this.isLoading = true;
                this.showInsert = true;
                this.insertOrUpdate = '添加';
            },
            goBack: function () {
                window.history.back();
            },
            insertData: function () {
                var that = this;
                if (that.form.id != null) {
                    axios.put('/updateById', that.form
                    ).then(function() {
                        that.form = {};
                        that.showInsert = false;
                        that.selectAll();
                    })
                    return;
                }
                if (that.form.testName == null || that.form.testName === '') {
                    that.field = '名称 ';
                    that.showInsertNotice = true;
                    return;
                }
                axios.post('/insert', that.form
                ).then(function () {
                    that.form = {};
                    that.showInsert = false;
                    that.selectAll()
                })
            },
            doLayout: function() {
                this.$nextTick(() => {
                    this.$refs.table.doLayout()
                })
            },
            selectRow: function(currentRow) {
                let s = JSON.stringify(currentRow);
                this.selectedRow = currentRow;
            },
            updateById: function(row) {
                var that = this;
                if (that.selectedRow.id == null && (row == null || row.id == null)) {
                    return;
                }
                that.showInsert = true;
                let s = JSON.stringify(row == null ? that.selectedRow : row);
                that.form = JSON.parse(s);
                this.insertOrUpdate = '修改';
            },
            closeInsert: function() {
                this.showInsert = false;
                this.form = {};
            },
            deleteById: function(id) {
                var that = this;
                that.$confirm('确认删除', '删除', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: action => {
                        if (action === 'confirm') {
                            axios.delete('/deleteById?id=' + id
                            ).then(function() {
                                that.selectAll();
                            })
                        }
                    }
                })
            }
        },
        watch: {
            tableData(val) {
                this.doLayout()
            }
        }
    }
</script>

<style scoped>

</style>