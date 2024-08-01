// global.d.ts
declare global {
  namespace NodeJS {
    interface Global {
      // Remove mongoose references if not using mongoose anymore
    }
  }
}

export {};
