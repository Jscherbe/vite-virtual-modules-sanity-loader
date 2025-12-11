# Change Log

## 1.0.1

- This adds a path to the groq queries directory for sanity loader by default as watch path for a given virtual module. The path has been converted from relative (to project root) to absolute path so that it works correctly with virtual modules which by default set the cwd for the watcher to the virtual module's directory, so project relative paths won't work. 
  - TLDR: This correctly watches your @ulu/sanity-loader > config.paths.queries directory for changes and will refetch data if the query file your using has been changed/updated
