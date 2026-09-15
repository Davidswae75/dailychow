import { computed, onMounted, onUnmounted, ref } from "vue";

type ScreenSizes = "sm" | "md" | "lg" | "xl";

export function useScreenSize() {
  const screenSizes = {
    sm: 320,
    md: 769,
    lg: 1024,
    xl: 1200,
  };

  const currentScreen = ref<ScreenSizes>("sm");
  const width = ref(0);

  const updateScreen = () => {
    const { sm, md, lg, xl } = screenSizes;

    if (width.value >= xl) {
      currentScreen.value = "xl";
    } else if (width.value >= lg) {
      currentScreen.value = "lg";
    } else if (width.value >= md) {
      currentScreen.value = "md";
    } else {
      currentScreen.value = "sm";
    }
  };

  const handleResize = () => {
    width.value = window.innerWidth;
    updateScreen();
  };

  onMounted(() => {
    width.value = window.innerWidth;
    updateScreen();
    window.addEventListener("resize", handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
  });

  const smallerThan = (screen:  keyof typeof screenSizes) => {
    return screenSizes[screen] > width.value ? true : false
  }

  const greaterThan = (screen:  keyof typeof screenSizes) => {
    return screenSizes[screen] < width.value ? true : false
  }

  const equalTo = (screen:  keyof typeof screenSizes) => {
    return screenSizes[screen] === width.value ? true : false
  }



  return {
    currentScreen,
    smallerThan,
    greaterThan,
    equalTo
  };
}