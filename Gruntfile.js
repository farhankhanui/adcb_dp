var utc = new Date().toJSON().slice(0, 10).replace(/-/g, "");
var packageName = "package/package" + utc;
var filesDirectory = "common";
const sass = require("node-sass");
module.exports = function (grunt) {
  "use strict";
  grunt.initConfig({
    dirs: {
      output: filesDirectory,
    },
    assemble: {
      options: {
        flatten: true,
        partials: ["templates/includes/*.hbs", "templates/includes/**/*.hbs"],
        layoutdir: "templates/layouts",
        layout: "default.hbs",
        helpers: ["lib/**/*.js"],
        removeHbsWhitespace: true,
        production: "false",
        filesDirectory: filesDirectory,
        version: Math.floor(Math.random() * 1000 + 1),
        images: "common/images",
        componentsCSS: "en/common/css/components",
        hasGradeint: true,
      },
      en: {
        options: {
          language: "en",
        },
        files: { "en/": ["templates/*.hbs"] },
      },
      ar: {
        options: {
          language: "ar",
        },
        files: { "ar/": ["templates/*.hbs"] },
      },
      enProduction: {
        options: {
          language: "en",
          production: "true",
        },
        files: { "en/": ["templates/*.hbs"] },
      },
      arProduction: {
        options: {
          language: "ar",
          production: "true",
        },
        files: { "ar/": ["templates/*.hbs"] },
      },
    },
    sass: {
      options: {
        sourceMap: false,
        implementation: sass,
      },
      dist: {
        files: [
          {
            expand: true,
            flatten: true,
            cwd: "<%= dirs.output %>/sass/components",
            src: ["**/*.scss"],
            dest: "en/common/css/components",
            ext: ".css",
          },
        ],
      },
    },
    watch: {
      sass: {
        files: [
          "<%= dirs.output %>/sass/*.scss",
          "<%= dirs.output %>/sass/**/*.scss",
          "templates/components/**/*.scss",
        ],
        tasks: ["clean", "sass", "rtlcss", "postcss", "cssmin", "ftp_push"],
      },
      assemble: {
        files: ["**/*.hbs"],
        tasks: ["assemble:en", "assemble:ar"],
      },
      compass: {
        files: ["<%= dirs.output %>/images/icons/*.png"],
        tasks: ["compass"],
        options: {
          event: ["changed", "added", "deleted"],
        },
      },
      configFiles: {
        files: ["Gruntfile.js"],
        options: {
          reload: true,
        },
      },
      options: {
        spawn: false,
        livereload: {
          host: "localhost",
          port: 9000,
        },
      },
    },
    cssmin: {
      target: {
        files: [
          {
            expand: true,
            cwd: "<%= dirs.output %>/css/components/",
            src: ["*.css", "components/*.css", "!*.min.css", "!*.css.map"],
            dest: "<%= dirs.output %>/css/components",
            ext: ".min.css",
          },
        ],
      },
    },
    tinypng: {
      options: {
        apiKey: "JrouuOhPO189HHtUstQnQ1zAzJ3etgon",
        checkSigs: false,
        sigFile: "file_sigs.json",
        summarize: true,
        showProgress: true,
        stopOnImageError: true,
      },
      compress_jpg: {
        expand: true,
        src: "<%= dirs.output %>/images/**/*.{jpg,jpeg}",
        dest: "compress-img/",
        // ext: '.min.png'
      },
      compress_png: {
        expand: true,
        src: [
          "<%= dirs.output %>/images/**/*.png",
          "!<%= dirs.output %>/images/icons/*.png",
        ],
        dest: "compress-img/",
        // ext: '.min.png'
      },
    },
    image: {
      dynamic: {
        files: [
          {
            expand: true,
            cwd: "<%= dirs.output %>/images/",
            src: ["**/*.{png,jpg,jpeg,gif,svg}"],
            dest: "compress-img/",
          },
        ],
      },
    },
    concat: {
      options: {
        separator: ";\n",
      },
      dist: {
        src: [
          "<%= dirs.output %>/js/jquery/*.js",
          "<%= dirs.output %>/js/lib/*.js",
          "<%= dirs.output %>/js/default.js",
        ],
        dest: "<%= dirs.output %>/js/app.js",
      },
    },
    uglify: {
      my_target: {
        files: {
          "<%= dirs.output %>/js/default.min.js":
            "<%= dirs.output %>/js/default.js",
        },
      },
    },
    compass: {
      // Task
      dist: {
        // Target
        options: {
          config: "config.rb",
          force: true,
          sassDir: "<%= dirs.output %>/sass/globals/",
          cssDir: "<%= dirs.output %>/css/components/",
          environment: "development",
        },
      },
    },
    htmlmin: {
      // Task
      en: {
        options: {
          // Target options
          removeComments: true,
          collapseWhitespace: true,
        }, // Another target
        files: [
          {
            expand: true,
            cwd: "en/",
            src: ["*.html"],
            dest: "en/",
          },
        ],
      },
      ar: {
        options: {
          // Target options
          removeComments: true,
          collapseWhitespace: true,
        }, // Another target
        files: [
          {
            expand: true,
            cwd: "ar/",
            src: ["*.html"],
            dest: "ar/",
          },
        ],
      },
    },
    zip: {
      zip: {
        src: [
          "<%= dirs.output %>/css/**/*.css",
          "<%= dirs.output %>/js/**/*.js",
          "<%= dirs.output %>/images/**/*",
        ],
        dest: packageName + ".zip",
      },
    },

    rtlcss: {
      myTask: {
        // task options
        options: {
          // generate source maps
          // autoRename: true,
          map: { inline: false },
          // rtlcss options
          opts: {
            clean: false,
          },
          // rtlcss plugins
          plugins: [],
          // save unmodified files
          saveUnmodified: true,
        },
        expand: true,
        cwd: "en/common/css/components",
        //dest: 'rtl',
        //files: {
        //    'styles-rtl.css': 'styles.css',
        //},
        src: ["*.css"],
        dest: "ar/common/css/components",
        ext: "-ar.css",
      },
    },
    clean: {
      build: {
        src: [
          // "ar/*.html",
          // "en/*.html",
          // "<%= dirs.output %>/js/app.js",
          // "<%= dirs.output %>/js/app.min.js",
          "<%= dirs.output %>/css/components/*.css",
          "<%= dirs.output %>/css/components/*.map",
        ],
      },
    },
    postcss: {
      prefixes: {
        options: {
          map: {
            inline: false,
          },
          processors: [
            require("autoprefixer")({ browsers: "last 4 versions" }), // add vendor prefixes
            require("postcss-flexbugs-fixes")(),
          ],
        },
        files: [
          {
            expand: true,
            cwd: "<%= dirs.output %>/css/components",
            src: ["*.css", "components/*.css", "!icons.css"],
            dest: "<%= dirs.output %>/css/components",
          },
        ],
      },
    },
    browserSync: {
      dev: {
        bsFiles: {
          src: [
            "en/common/css/*.css",
            "en/common/js/*.js",
            "en/*.html",
            "en/common/css/components/*.css",
          ],
        },
        options: {
          open: false,
          server: "./",
          watchTask: true,
        },
      },
    },
    copy: {
      main: {
        files: [
          // includes files within path and its sub-directories
          {
            expand: true,
            src: ["<%= dirs.output %>/css/**", "<%= dirs.output %>/js/*.js"],
            dest: "c:/inetpub/wwwroot/zandsc.dev.local/",
          },
        ],
      },
    },
    ftp_push: {
      your_target: {
        options: {
          authKey: "serverA",
          host: "162.13.154.170",
          dest: "/ADCB Re Skin/Web/",
          port: 21,
        },
        files: [
          {
            expand: true,
            cwd: ".",
            src: [
              "en/common/css/components/common.css",
              "en/common/css/components/header-n-footer.css",
              "ar/common/css/components/common-ar.css",
              "ar/common/css/components/header-n-footer-ar.css",
            ],
          },
        ],
      },
    },
  });
  // Load the  plugin.
  grunt.loadNpmTasks("grunt-ftp-push");
  grunt.loadNpmTasks("grunt-assemble");
  grunt.loadNpmTasks("grunt-sass");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-zip");
  grunt.loadNpmTasks("grunt-tinypng");
  grunt.loadNpmTasks("grunt-contrib-htmlmin");
  grunt.loadNpmTasks("grunt-contrib-compass");
  grunt.loadNpmTasks("grunt-rtlcss");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-browser-sync");
  grunt.loadNpmTasks("grunt-postcss");
  grunt.loadNpmTasks("grunt-image");
  grunt.loadNpmTasks("grunt-contrib-copy");
  // grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.registerTask("default", ["browserSync", "watch"]);
  grunt.registerTask("build", [
    "clean",
    "assemble:enProduction",
    "assemble:arProduction",
    "htmlmin",
    // "compass",
    "sass",
    "rtlcss",
    "postcss",
    "cssmin",
    "concat",
    "uglify",
    // 'imagemin'
  ]);
  grunt.registerTask("create", [
    "clean",
    "assemble:en",
    "assemble:ar",
    // "compass",
    "sass",
    "rtlcss",
    "postcss",
  ]);
  grunt.registerTask("createPackage", ["create", "zip"]);
  // define sync task
  grunt.registerTask("sync", ["browserSync", "watch"]);
  grunt.registerTask("common", ["clean", "create", "uglify", "cssmin", "zip"]);
  grunt.registerTask("ftp", "ftp_push");
};


