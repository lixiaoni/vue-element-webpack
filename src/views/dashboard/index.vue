<template>
  <!-- <div class="chart-container">
    <chart height="100%" width="100%"/>
  </div> -->
  <div class="dashboard-container">
    <component :is="currentRole"/>
  </div>
</template>

<script>
// import Chart from '@/components/Charts/mixChart'

// export default {
//   name: 'MixChart',
//   components: { Chart }
// }
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'adminDashboard'
    }
  }
}
</script>
<style scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
</style>
