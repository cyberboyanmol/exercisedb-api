import { OpenAPIHono } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { Home } from "./pages/home";
import { Routes } from "@/common/types";
import type { HTTPException } from "hono/http-exception";

export class App {
  private app: OpenAPIHono;

  constructor(routes: Routes[]) {
    this.app = new OpenAPIHono();
    this.initializeGlobalMiddleware();
    this.initializeRoutes(routes);
    this.initializeSwaggerUI();
    this.initializeRouteFallback();
    this.initializeErrorHandler();
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      route.initRoutes();
      this.app.route("/api", route.controller);
    });
    this.app.route("/", Home);
  }

  private initializeGlobalMiddleware() {
    this.app.use(logger());
    this.app.use(prettyJSON());
  }

  private initializeSwaggerUI() {
    this.app.doc31("/swagger", (c) => {
      const { protocol: urlProtocol, hostname, port } = new URL(c.req.url);
      const protocol = c.req.header("x-forwarded-proto")
        ? `${c.req.header("x-forwarded-proto")}:`
        : urlProtocol;

      return {
        openapi: "3.1.0",
        info: {
          version: "1.0.0",
          title: "ExerciseDB API",
          description: `# Introduction 
          \nExerciseDB API, accessible at [exercisedb-api.vercel.app](https://exercisedb-api.vercel.app), is an exercises API that allows users to access high-quality exercises data which consists 1300+ exercises. 
         This API offers extensive information on each exercise, including target body parts, equipment needed, GIFs for visual guidance, and step-by-step instructions.\n`,
        },
        servers: [
          {
            url: `${protocol}//${hostname}${port ? `:${port}` : ""}`,
            description: "Current environment",
          },
        ],
      };
    });

    this.app.get(
      "/docs",
      apiReference({
        pageTitle: "ExerciseDB API Documentation",
        theme: "bluePlanet",
        isEditable: false,
        layout: "modern",
        darkMode: true,
        metaData: {
          applicationName: "ExerciseDB API",
          author: "Anmol Gangwar",
          creator: "Anmol Gangwar",
          publisher: "Anmol Gangwar",
          robots: "index follow",
          description:
            "Access detailed data on over 1300+ exercises with the ExerciseDB API. This API offers extensive information on each exercise, including target body parts, equipment needed, GIFs for visual guidance, and step-by-step instructions.",
        },
        spec: {
          url: "/swagger",
        },
      })
    );
  }

  private initializeRouteFallback() {
    this.app.notFound((c) => {
      return c.json(
        {
          success: false,
          message:
            "oops route not found!!. check docs at https://exercisedb-api.vercel.app/docs",
        },
        404
      );
    });
  }
  private initializeErrorHandler() {
    this.app.onError((err, c) => {
      const error = err as HTTPException;
      return c.json(
        { success: false, message: error.message },
        error.status || 500
      );
    });
  }
  public getApp() {
    return this.app;
  }
}
