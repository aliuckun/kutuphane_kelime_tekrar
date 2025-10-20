// global.d.ts

// TypeScript'e, .css uzantılı dosyaları güvenli bir şekilde
// içe aktarabileceğini söyleyen tip tanımı.
declare module '*.css' {
    const content: any;
    export default content;
}