module.exports = function(grunt) {
  
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        dist: {
            outputFolder: './dist', 
            outputJsMap: './dist/<%= pkg.name %>.js.map', 
            outputJsFile: './dist/<%= pkg.name %>-src.js', 
            outputJsMinFile: './dist/<%= pkg.name %>.min.js', 
            outputJsPluginsFile: './dist/plugins.js', 
            outputCssFile: './dist/<%= pkg.name %>-src.css', 
            outputCssMinFile: './dist/<%= pkg.name %>.min.css',
            outputCssPluginsFile: './dist/plugins.css', 
        }, 
        concat: {
            options: {
                separator: ';',
                stripBanners: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */',
            },
            dist: {
                src: [
                    'js/app/_landing-frame.js', 
                    'js/_<%= pkg.name %>.js', 
                ],
                dest: 'js/<%= pkg.name %>.js'
            },
            plugins: {
                files: {
                    '<%= dist.outputJsPluginsFile %>': [
                        'node_modules/jquery/dist/jquery.min.js',
                        'node_modules/materialize-css/dist/js/materialize.min.js'
                    ] , 
                },
            }
        },
        babel: {
            options: {
                sourceMap: true,
                presets: ['es2015']
            },
            dist: {
                files: {
                    '<%= dist.outputJsFile %>': 'js/<%= pkg.name %>.js'
                }
            }
        }, 
        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: {  
                    '<%= dist.outputCssFile %>': './sass/<%= pkg.name %>.scss'
                }
            }, 
            plugins: {
                options: {
                    style: 'expanded'
                },
                files: {  
                    '<%= dist.outputCssPluginsFile %>': './sass/materialize-theming.scss'
                }
            }
        }, 
        autoprefixer: {
            options: {
                browsers: ['last 6 versions']
            },
            css: {
                src: '<%= dist.outputCssFile %>'
            },
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n', 
                sourceMap: true
            },
            build: {
                src: '<%= dist.outputJsFile %>',
                dest: '<%= dist.outputJsMinFile %>'
            }
        },  
        htmlbuild: {
            dist: {
                src: 'index.html',
                dest: 'dist/',
                options: {
                    beautify: true,
                    prefix: '',
                    relative: true,
                    basePath: false,
                    scripts: {
                        bundle: [
                            '<%= dist.outputFolder %>/plugins.js',
                            '<%= dist.outputFolder %>/templates.js',
                            '<%= dist.outputJsMinFile %>'
                        ]
                    },
                    styles: {
                        bundle: [
                            '<%= dist.outputFolder %>/*.css',
                        ]
                    },
                    sections: {
                        templates: {
                            frame: 'templates/landing-frame.html',
                            header: 'templates/landing-header.html'
                        }
                    },
                    data: {
                        // Data to pass to templates
                        version: "0.1.0",
                        title: "SoftUI-Basic",
                    },
                }
            }
        }, 
        copy: {
            main: {
                files: [
                    // includes files within path
                    {expand: true, cwd: 'node_modules/materialize-css/', src: ['fonts/**'], dest: '<%= dist.outputFolder %>'},
                    {expand: true, src: ['img/**'], dest: '<%= dist.outputFolder %>'},
                    {expand: true, src: ['*.html'], dest: '<%= dist.outputFolder %>'},
                ],
            },
        },
        htmlConvert: {
            options: {
                rename: function (name) {
                    return name.match(/([\w\d\.-]+).html$/)[1].replace(/\.|-(\w)/, (s) => s.toUpperCase() ).replace(/\.|-/, "");
                }
            },
            templates: {
                src: ['templates/**/*.html'],
                dest: '<%= dist.outputFolder %>/templates.js'
            },
        },
        watch: {
            configFiles: {
                files: [ 'Gruntfile.js' ],
                options: {
                    reload: true
                }
            }, 
            css: {
                files: 'sass/**/*.scss', 
                tasks: ['sass:dist', 'autoprefixer', 'htmlbuild']
            }, 
            js: {
                files: 'js/**/*.js', 
                tasks: ['concat:dist', 'babel', 'uglify', 'htmlbuild']
            }, 
            html: {
                files: ['index.html', 'templates/*.html'], 
                tasks: ['htmlConvert']
            }, 
            copyFiles: {
                files: ['*.html', 'templates/**/*.html', 'img/*'],
                tasks: ['htmlConvert', 'copy', 'htmlbuild']
            }
        }
    });

    
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-html-build');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-html-convert');

    grunt.registerTask('default', ['concat', 'sass', 'autoprefixer', 'uglify', 'htmlConvert', 'copy', 'htmlbuild', 'watch']);

};