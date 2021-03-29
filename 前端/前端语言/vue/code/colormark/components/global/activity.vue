<template>
  <div class="activity-list__item">
    <img class="activity-img" :src="activity.contImg" alt="" />
    <div class="activity-body">
      <span class="body-title">{{ activity.title }}</span>
      <span class="body-time__range"
        >{{ activity.startTime }} - {{ activity.endTime }}</span
      >
      <div class="body-detail">
        <span><img src="@/assets/img/view.png" alt="" />{{ activity.views }}</span>
        <color-space />
        <span><img src="@/assets/img/time.png" alt="" />{{ activity.time }}</span>
        <span><img src="@/assets/img/person.png" alt="" />{{ activity.person }}</span>
        <span><img src="@/assets/img/like.png" alt="" />{{ activity.like }}</span>
      </div>
    </div>
  </div>
</template>
<script>
// 空白占位符
export default {
  name: 'Activity',
  props: {
    activity: {
      required: true,
    },
  },
};
</script>

<style lang="less" scoped>
.activity-list__item {
  flex: 0 0 auto;
  border-radius: @basic-radius;
  height: 5.1rem;
  width: 6.56rem;

  background-color: #ffffff;
  margin-bottom: @me-distant;
  cursor: pointer;

  .activity-img {
    width: 100%;
  }

  .activity-body {
    width: 100%;
    padding: 0 @me-distant;

    span {
      display: block;
      line-height: 1em;
    }

    .body-title {
      font-size: 0.18rem;
      font-weight: 500;
      line-height: 3em;
    }

    .body-time__range {
      font-size: @mini-font-size;
      font-weight: 400;
    }

    .body-detail {
      font-size: @mini-font-size;
      font-weight: 400;
      margin: @me-distant 0;
      display: flex;
      span {
        &:nth-of-type(2),
        &:nth-of-type(3) {
          margin-right: @me-distant;
        }
      }
    }
  }
}
</style>