<template>
  <div>
    <div id="stars-container">
      <div id="stars" />
      <div id="stars2" />
      <div id="stars3" />
    </div>
    <div class="has-z-index-1">
      <NavigationBar />
      <section class="main-content">
        <div class="container">
          <Nuxt />
        </div>
      </section>
    </div>
    <FooterBar />
  </div>
</template>

<script>
import NavigationBar from '~/components/NavigationBar.vue'
import FooterBar from '~/components/FooterBar.vue'
export default {
  name: 'DefaultLayout',
  components: { NavigationBar, FooterBar }
}
</script>

<style lang="scss">
/* Hide scrollbar for Chrome, Safari and Opera */
body::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
body {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

@mixin translate50
{
  -webkit-transform: translate(-50, -50%);
  -ms-transform: translate(-50, -50%);
  -o-transform: translate(-50, -50%);
  transform: translate(-50, -50%);
}

@mixin roundedCorners
{
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
}

@mixin rotateBase
{
  -webkit-transform: rotate3d(-1, 1, 0, 0deg);
  -ms-transform: rotate3d(-1, 1, 0, 0deg);
  -o-transform: rotate3d(-1, 1, 0, 0deg);
  transform: rotate3d(-1, 1, 0, 0deg);
}

@mixin rotateRight
{
  -webkit-transform: rotate3d(-1, 1, 0, 30deg);
  -ms-transform: rotate3d(-1, 1, 0, 30deg);
  -o-transform: rotate3d(-1, 1, 0, 30deg);
  transform: rotate3d(-1, 1, 0, 30deg);
}

@mixin rotateLeft
{
  -webkit-transform: rotate3d(-1, 1, 0, -30deg);
  -ms-transform: rotate3d(-1, 1, 0, -30deg);
  -o-transform: rotate3d(-1, 1, 0, -30deg);
  transform: rotate3d(-1, 1, 0, -30deg);
}

// n is number of stars generated
@function generateStars ($n)
{
  $value: '#{0} #{random(2000)}px #{random(2000)}px #FFF';

  @for $i from 2 through $n
  {
    $value: '#{$value} , #{random(2000)}px #{random(2000)}px #FFF';
  }

  @return unquote($value);
}

$stars-small:  generateStars(700);
$stars-medium: generateStars(200);
$stars-big:    generateStars(100);

body
{
  overflow: hidden;
}

#stars-container
{
  height: 100%;
  width: 200%;
  background: radial-gradient(ellipse at bottom, #1B2735 0%, #191F24 100%);
  overflow: hidden;
  z-index: -1;
  position: absolute;
  @include translate50;
}

#stars
{
  width: 1px;
  height: 1px;
  background: transparent;
  box-shadow: $stars-small;
  animation : animateStars 28.5s ease-in-out infinite;
  @include roundedCorners;

  &::after
  {
    content: " ";
    position: absolute;
    margin: auto;
    top: 0; left: 0; right: 0; bottom: 0;
    width: 1px;
    height: 1px;
    background: transparent;
    box-shadow: $stars-small;
    @include roundedCorners;
  }
}

#stars2
{
  width: 2px;
  height: 2px;
  background: transparent;
  box-shadow: $stars-medium;
  animation : animateStars 30s ease-in-out infinite;
  @include roundedCorners;

  &::after
  {
    content: " ";
    position: absolute;
    margin: auto;
    top: 0; left: 0; right: 0; bottom: 0;
    width: 2px;
    height: 2px;
    background: transparent;
    box-shadow: $stars-medium;
    @include roundedCorners;
  }
}

#stars3
{
  width: 3px;
  height: 3px;
  background: transparent;
  box-shadow: $stars-big;
  animation : animateStars 31.5s ease-in-out infinite;
  @include roundedCorners;

  &:after
  {
    content: " ";
    position: absolute;
    margin: auto;
    top: 0; left: 0; right: 0; bottom: 0;
    width: 3px;
    height: 3px;
    background: transparent;
    box-shadow: $stars-big;
    @include roundedCorners;
  }
}

@keyframes animateStars
{
  0%{@include rotateBase;}
  25%{@include rotateRight;}
  50%{@include rotateBase;}
  75%{@include rotateLeft;}
  100%{@include rotateBase;}
}
</style>
