<template lang="pug">
.section-cosmos
  .section-cosmos-container
    header.section-cosmos-header
      h2.section-cosmos-title The Cosmos Network
      .section-cosmos-subtitle Launching Soon
    main.section-cosmos-main
      .section-cosmos-description All of us at Tendermint are working hard on preparing the Cosmos Network for release. We"re aiming to launch soon &ndash; #[a(href="https://cosmos.network/roadmap") follow our roadmap].
      btn.section-cosmos-btn(type="anchor" :href="links.cosmos.website" size="lg" value="Visit Cosmos Network" theme="tendermint" icon="external-link")
</template>

<script>
import { mapGetters } from 'vuex'
import Btn from '@nylira/vue-button'
export default {
  name: 'section-cosmos',
  components: {
    Btn
  },
  computed: {
    ...mapGetters(['config', 'links'])
  }
}
</script>

<style lang="stylus">
@import '~variables'

.section-cosmos
  border-bottom 1px solid lighten(mcolor, 10%)
  color lighten(mcolor, 60%)

.section-cosmos-container
  max-width 40rem
  margin 0 auto

  text-align center
  padding 2rem 1.5rem

.section-cosmos-header, .section-cosmos-description
  margin-bottom 1.5rem

.section-cosmos-title
  font-size 1.5rem
  font-weight 600
  color lighten(mcolor, 75%)

.section-cosmos-subtitle
  font-size 1.375rem

.section-cosmos-form
  border none

.section-cosmos-form .input-group
  margin 0

.section-cosmos-btn.ni-btn
  width 100%
  margin 0 auto
  max-width 18rem

.section-cosmos-description
  margin-left auto
  margin-right auto
  max-width 26rem
  font-size 0.875rem
  a
    color lighten(mcolor, 80%)
    font-weight 500

@media screen and (min-width: 768px)
  .section-cosmos-container
    padding-top 4rem
    padding-bottom 4rem

  .section-cosmos-header
    margin-bottom 2rem

  .section-cosmos-title
    font-size 2rem

  .section-cosmos-subtitle
    font-size 1.66rem

  .section-cosmos-description
    font-size 1rem
    margin-bottom 2.25rem
</style>
