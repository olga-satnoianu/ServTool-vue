import { ref } from "vue";
import { defineStore } from "pinia";

export const useFormsStore = defineStore("forms", () => {
    const isScrolledOnce = ref(false);

    const scrollToInvalidInput = (e: Event, noScrollOnError: boolean) => {
        if (noScrollOnError || isScrolledOnce.value) return;

        isScrolledOnce.value = true;
        const element = e.target as HTMLInputElement;

        element?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
        element?.focus();

        setTimeout(() => {
            isScrolledOnce.value = false;
        }, 1000);
    };

    const useRandomIntFromInterval = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    const useSlug = (label = "") => {
        const randomNumber = useRandomIntFromInterval(1000, 9999);
        if (!label || typeof label !== "string") return `${randomNumber}`;
        return label.toLowerCase().split(" ").join("-") + `-${randomNumber}`;
    };

    return { scrollToInvalidInput, useSlug };
});

