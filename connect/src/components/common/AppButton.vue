<!-- (C) 2018 SEIKO SOLUTIONS INC. -->

<template>
  <button
    :class="cssClasses"
    v-on:click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script>
export default{
  name: 'AppButton',
  props: {
    type: String,
    size: String,
    disabled: Boolean
  },
  computed: {
    cssClasses () {
      let classes = ['app-button']
      if (this.size) {
        classes.push('app-button--' + this.size)
      }
      if (this.type && !this.disabled) {
        classes.push('app-button--' + this.type)
      }
      if (this.disabled) {
        classes.push('app-button--disabled')
      }
      return classes.join(' ')
    }
  }
}
</script>

<style lang="scss" scoped>
//
// Base Style
//
.app-button {
  border: none;
  border-radius: 4px;
  box-sizing: border-box;
  background: $border-color-secondary;
  cursor: pointer;
  transition-property: color, background, box-shadow;
  transition-duration: 0.1s;
  display: inline-flex;
  vertical-align: middle;
  align-items: center;
}
.app-button:focus {
  outline: 0;
}

// With material icons
.app-button > i {
  margin-right: 4px;
}

//
// Button Type
//
// Primary
.app-button--primary {
  color: #fff;
  background: $ui-color-primary;
}
.app-button--primary:hover {
  background: lighten($ui-color-primary, 2%);
  box-shadow: 0px 2px 12px rgba(0, 153, 255, 0.7);
}
.app-button--primary:focus {
  background: darken($ui-color-primary, 2%);
  box-shadow: 0px 2px 8px rgba(0, 153, 255, 0.7);
}

// Secondary
.app-button--secondary {
  color: $font-color-primary;
  border: 2px solid $border-color-primary;
  background: #fff;
}
.app-button--secondary:hover {
  color: liten($font-color-primary, 20%);
  box-shadow: 0px 1px 8px rgba(150, 150, 150, 0.3);
}
.app-button--secondary:focus {
  background: darken(#fff, 1%);
  box-shadow: 0px 0px 5px rgba(150, 150, 150, 0.2);
}

// Floating Action
.app-button--floating {
  color: #fff;
  background: $ui-color-primary;
  box-shadow: 0px 3px 12px rgba(0, 153, 255, 0.7);
}
.app-button--floating:hover {
  background: lighten($ui-color-primary, 3%);
  box-shadow: 0px 5px 16px rgba(0, 153, 255, 0.7);
}
.app-button--floating:focus {
  background: darken($ui-color-primary, 3%);
  box-shadow: 0px 4px 12px rgba(0, 153, 255, 0.7);
}

// Text
.app-button--text {
  color: $font-color-primary;
  background: none;
}
.app-button--text:hover {
  color: $ui-color-primary;
  background-color: rgba(160, 217, 255, 0.26);
}
.app-button--text:focus {
  background-color: darken(rgba(160, 217, 255, 0.26), 12%);
}

// Link
.app-button--link {
  color: $font-color-secondary;
  background: none;
}
.app-button--link:hover {
  color: $ui-color-primary;
}

// Danger (like a delete button)
.app-button--danger {
  color: $ui-color-danger;
  background: none;
}
.app-button--danger:hover {
  color: darken($ui-color-danger, 6%);
  background: rgba(255, 155, 161, 0.18);
}
.app-button--danger:focus {
  background-color: darken(rgba(255, 155, 161, 0.18), 12%);
}

// Disabled
.app-button--disabled {
  color: lighten($font-color-secondary, 6%);
  background: darken($border-color-secondary, 2%);
  cursor: not-allowed;
}
.app-button--disabled:hover {
  color: lighten($font-color-secondary, 6%);
  background: darken($border-color-secondary, 2%);
}

//
// Size
//
// Small
.app-button--sm {
  font-size: 12px;
  padding: 8px 10px;
  &.app-button--secondary {
    padding: 4px 6px;
  }
  &.app-button--link {
    padding: 0;
  }
}

// Middle
.app-button--md {
  font-size: 14px;
  padding: 10px 14px;
  &.app-button--secondary {
    padding: 8px 12px;
  }
  &.app-button--link {
    padding: 0;
  }
}

// Large
.app-button--lg {
  font-size: 16px;
  padding: 12px 16px;
  &.app-button--secondary {
    padding: 8px 12px;
  }
  &.app-button--link {
    padding: 0;
  }
}
</style>
