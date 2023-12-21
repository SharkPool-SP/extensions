// Name: Runtime Options
// ID: runtimeoptions
// Description: Get and modify turbo mode, framerate, interpolation, clone limit, stage size, and more.

(function (Scratch) {
  "use strict";

  if (!Scratch.extensions.unsandboxed) {
    throw new Error("Runtime Options extension needs to be run unsandboxed");
  }

  const greenFlagURI =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAABFFBMVEUAAACAgABVqlVJkklAn0BNmTNLljxGlzpDmzdFmjpGmzxHmz9Fmj1FmT5Emj1GmT1GmD1EmDxGmTxEmT1GmjxGmT1FmDxEmT5EmTxGmT5FmD1GmT5FmT1Gmj1EmT5FmT1FmT1FmDxGmT1FmjxLs09LtE9Jr0xJsk1Js05JtVBKtU5KtVBKtlBJrkpJsE1KtlFIrEpIsExLt1FLuFJKuVNIqkhLulNIp0VJqkhKtlJLvVRMvFNFmT5GpUVFmT1HpEVHokNMvlVFmT1Ho0NFmTxLvlVGoUFMvlVLvlVGn0BFmT1Nv1ZEmz5FmTxFmTxFmT1NvlZFmz9FmT5FnT9FnD5GnT9Mv1ZMv1ZMv1ZFmT1Mv1b////70P2GAAAAWXRSTlMAAgMHCAoRFhcwMz0/RkdQVGFmaWpxcnh7gIGEhZKZo6eprLq/v8DAwMDAwMDBwcHCwsPDxcbIysrLzM3Pz9DQ1NTV1dfZ29vg4uXm5+jp6ens7fDx9Pv8/nPb5aAAAAABYktHRFt0vJU0AAAAsUlEQVQoz2NgwA3YhNiwS4hHykoou9goCrKiSUhGhqhZe7gbm3rxQwQ4BJihEupRYODooMDFyMAu6uMsgyoRFW5kHxjkqeuhL4cmAQM4JXRwSWjjktDEJaGFS0IVIeFtZuIaAZdQgUmY2/oqyTu5WcEkNGAS/kJMQJrbySAAJBxmGSoIlYAoYGCR8rPVM7QItuNlQJVgYGDlE5MU5kSErhz2+KCihEikNHYJJh5mBhIAADBcR/r5OJzCAAAAAElFTkSuQmCC";
  const TURBO_MODE = "turbo mode";
  const INTERPOLATION = "interpolation";
  const REMOVE_FENCING = "remove fencing";
  const REMOVE_MISC_LIMITS = "remove misc limits";
  const HIGH_QUALITY_PEN = "high quality pen";

  class RuntimeOptions {
    constructor() {
      Scratch.vm.runtime.on("STAGE_SIZE_CHANGED", () => {
        Scratch.vm.runtime.startHats("runtimeoptions_onRunT", { MENU : "stage size" })
      });
      Scratch.vm.runtime.on("FRAMERATE_CHANGED", () => {
        Scratch.vm.runtime.startHats("runtimeoptions_onRunT", { MENU : "framerate" })
      });
      Scratch.vm.runtime.on("INTERPOLATION_CHANGED", () => {
        Scratch.vm.runtime.startHats("runtimeoptions_onRunT", { MENU : "interpolation" })
      });
      Scratch.vm.on("TURBO_MODE_ON", () => {
        Scratch.vm.runtime.startHats("runtimeoptions_onTurbomode", { OPT : "on" })
      });
      Scratch.vm.on("TURBO_MODE_OFF", () => {
        Scratch.vm.runtime.startHats("runtimeoptions_onTurbomode", { OPT : "off" })
      });
    }
    getInfo() {
      return {
        id: "runtimeoptions",
        name: Scratch.translate("Runtime Options"),
        color1: "#8c9abf",
        color2: "#7d8aab",
        color3: "#6f7b99",
        blocks: [
          {
            opcode: "getEnabled",
            text: Scratch.translate("[thing] enabled?"),
            blockType: Scratch.BlockType.BOOLEAN,
            arguments: {
              thing: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: TURBO_MODE,
                menu: "thing",
              },
            },
          },
          {
            opcode: "setEnabled",
            text: Scratch.translate("set [thing] to [enabled]"),
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              thing: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: TURBO_MODE,
                menu: "thing",
              },
              enabled: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "true",
                menu: "enabled",
              },
            },
          },

          "---",

          {
            opcode: "getFramerate",
            text: Scratch.translate("framerate limit"),
            blockType: Scratch.BlockType.REPORTER,
          },
          {
            opcode: "setFramerate",
            text: Scratch.translate("set framerate limit to [fps]"),
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              fps: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "30",
              },
            },
          },

          "---",

          {
            opcode: "getCloneLimit",
            text: Scratch.translate("clone limit"),
            blockType: Scratch.BlockType.REPORTER,
          },
          {
            opcode: "setCloneLimit",
            text: Scratch.translate("set clone limit to [limit]"),
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              limit: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "300",
                menu: "clones",
              },
            },
          },

          "---",

          {
            opcode: "getDimension",
            text: Scratch.translate({
              default: "stage [dimension]",
              description: "[dimension] is a dropdown of width and height",
            }),
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
              dimension: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "width",
                menu: "dimension",
              },
            },
          },
          {
            opcode: "setDimensions",
            text: Scratch.translate(
              "set stage size width: [width] height: [height]"
            ),
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              width: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "480",
              },
              height: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "360",
              },
            },
          },
          {
            opcode: "onTurbomode",
            blockType: Scratch.BlockType.EVENT,
            text: "when turbomode turns [OPT]",
            isEdgeActivated: false,
            arguments: {
              OPT: { type: Scratch.ArgumentType.STRING, menu: "ON_OFF" }
            }
          },
          {
            opcode: "onRunT",
            blockType: Scratch.BlockType.EVENT,
            text: "when [MENU] is set",
            isEdgeActivated: false,
            arguments: {
              MENU: { type: Scratch.ArgumentType.STRING, menu: "RUNTIME_OPT" }
            }
          },

          "---",

          {
            opcode: "setUsername",
            text: Scratch.translate("set username to [username]"),
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              username: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "greenFlag",
            text: Scratch.translate("run green flag [flag]"),
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              flag: {
                type: Scratch.ArgumentType.IMAGE,
                dataURI: greenFlagURI,
              },
            },
          },
        ],
        menus: {
          RUNTIME_OPT: ["stage size", "framerate", "interpolation"],
          ON_OFF: ["on", "off"],
          thing: {
            acceptReporters: true,
            items: [
              {
                text: Scratch.translate("turbo mode"),
                value: TURBO_MODE,
              },
              {
                text: Scratch.translate("interpolation"),
                value: INTERPOLATION,
              },
              {
                text: Scratch.translate("remove fencing"),
                value: REMOVE_FENCING,
              },
              {
                text: Scratch.translate("remove misc limits"),
                value: REMOVE_MISC_LIMITS,
              },
              {
                text: Scratch.translate("high quality pen"),
                value: HIGH_QUALITY_PEN,
              },
            ],
          },

          enabled: {
            acceptReporters: true,
            items: [
              {
                text: Scratch.translate("enabled"),
                value: "true",
              },
              {
                text: Scratch.translate("disabled"),
                value: "false",
              },
            ],
          },

          clones: {
            acceptReporters: true,
            items: [
              {
                text: Scratch.translate("default ({n})", {
                  n: "300",
                }),
                value: "300",
              },
              {
                text: Scratch.translate("Infinity"),
                value: "Infinity",
              },
            ],
          },

          dimension: {
            acceptReporters: true,
            items: [
              {
                text: Scratch.translate("width"),
                value: "width",
              },
              {
                text: Scratch.translate("height"),
                value: "height",
              },
            ],
          },
        },
      };
    }

    getEnabled({ thing }) {
      if (thing === TURBO_MODE) {
        return Scratch.vm.runtime.turboMode;
      } else if (thing === INTERPOLATION) {
        return Scratch.vm.runtime.interpolationEnabled;
      } else if (thing === REMOVE_FENCING) {
        return !Scratch.vm.runtime.runtimeOptions.fencing;
      } else if (thing === REMOVE_MISC_LIMITS) {
        return !Scratch.vm.runtime.runtimeOptions.miscLimits;
      } else if (thing === HIGH_QUALITY_PEN) {
        return Scratch.renderer.useHighQualityRender;
      }
      return false;
    }

    setEnabled({ thing, enabled }) {
      enabled = Scratch.Cast.toBoolean(enabled);

      if (thing === TURBO_MODE) {
        Scratch.vm.setTurboMode(enabled);
      } else if (thing === INTERPOLATION) {
        Scratch.vm.setInterpolation(enabled);
      } else if (thing === REMOVE_FENCING) {
        Scratch.vm.setRuntimeOptions({
          fencing: !enabled,
        });
      } else if (thing === REMOVE_MISC_LIMITS) {
        Scratch.vm.setRuntimeOptions({
          miscLimits: !enabled,
        });
      } else if (thing === HIGH_QUALITY_PEN) {
        Scratch.renderer.setUseHighQualityRender(enabled);
      }
    }

    getFramerate() {
      return Scratch.vm.runtime.frameLoop.framerate;
    }

    setFramerate({ fps }) {
      fps = Scratch.Cast.toNumber(fps);
      Scratch.vm.setFramerate(fps);
    }

    getCloneLimit() {
      return Scratch.vm.runtime.runtimeOptions.maxClones;
    }

    setCloneLimit({ limit }) {
      limit = Scratch.Cast.toNumber(limit);
      Scratch.vm.setRuntimeOptions({
        maxClones: limit,
      });
    }

    getDimension({ dimension }) {
      if (dimension === "width") {
        return Scratch.vm.runtime.stageWidth;
      } else if (dimension === "height") {
        return Scratch.vm.runtime.stageHeight;
      }
      return 0;
    }

    setDimensions({ width, height }) {
      width = Scratch.Cast.toNumber(width);
      height = Scratch.Cast.toNumber(height);
      Scratch.vm.setStageSize(width, height);
    }

    setUsername({ username }) {
      Scratch.vm.runtime.ioDevices.userData._username =
        Scratch.Cast.toString(username);
    }

    greenFlag() {
      Scratch.vm.runtime.greenFlag();
    }
  }

  Scratch.extensions.register(new RuntimeOptions());
})(Scratch);
