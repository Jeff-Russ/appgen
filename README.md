# duco

[Git Repository Home](http://github.com/Jeff-Russ/duco)

duco is a command line utility that kickstarts the process of setting up a new application project directory by collecting information, running scripts and cloning from a customizable assortment of templates. duco is not tied down to any one framework or API but it's original designed it for Node.js projects.  

duco is inspired by the idea of bringing the concept of Rails generators (with vastly expanded options) to Node.js.  

## APPGEN IS STILL IN DEVELOPMENT 
but it's nearing the point of having a usable build. I don't recommend running it at this time but you can certainly have a look a the source!  


# Walk Through of Usage

The duco directory can be placed anywhere such as `~/` and once `~/duco/load.sh` is run the `duco` command is available in the terminal.  

```bash
$ duco newapp default-node
```

The above will create a new node project by creating a new directory wherever you are and using `~/duco/templates/default-node` as a template.  

The template might be a built-in or you may add to the `duco/templates/` directory once you know the right way to do this. 