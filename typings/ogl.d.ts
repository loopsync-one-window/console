declare module 'ogl' {
  export class Renderer {
    constructor(options: { dpr?: number; alpha?: boolean; antialias?: boolean });
    gl: WebGLRenderingContext;
    setSize(width: number, height: number): void;
    render(options: { scene: Mesh<Triangle> }): void;
  }

  export class Program {
    constructor(gl: WebGLRenderingContext, options: { vertex: string; fragment: string; uniforms?: any });
    uniforms: any;
    remove?: () => void;
  }

  export class Mesh<T> {
    constructor(gl: WebGLRenderingContext, options: { geometry: T; program: Program });
    remove?: () => void;
  }

  export class Triangle {
    constructor(gl: WebGLRenderingContext);
    remove?: () => void;
  }
}