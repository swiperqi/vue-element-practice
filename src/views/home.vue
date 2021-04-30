<template>
    <el-container>
        <el-button-group class="btnGroup">
            <el-button @click="privateSelf">private-self</el-button>
        </el-button-group>
    </el-container>
</template>

<script>
    export default {
        name: 'home',
        methods: {
            privateSelf: function() {
                this.$router.push('/private-self')
            }
        }
    }
</script>

<style scoped>
    .btnGroup {
        margin: 5px auto;
    }
</style>
