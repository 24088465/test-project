<template>
  <div class="body">
    <div class="container">
      <div class="content">
        <div class="title">404-对不起！您访问的页面不存在</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    return {};
  },
};
</script>

<style lang="less" scoped>
.body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  color: black;
  display: table;
  font-weight: 100;
  font-family: 'Lato';
  .container {
    text-align: center;
    display: table-cell;
    vertical-align: middle;
    .content {
      text-align: center;
      display: inline-block;
      .title {
        font-size: 42px;
        margin-bottom: 40px;
      }
    }
  }
}
</style>
