declare module "*.png" {
    const value: any;
    export = value;
}

declare var window: Window;

interface Window {
    kakao: any;
    ourComponent?: any;
}
