Bun.serve({
  port: 3000,
  async fetch(request) {
    const url = new URL(request.url);

    let file = url.pathname.slice("/print".length);
    console.log(file);

    const asdf = Bun.spawn(["lpstat", "-a"], {stdout: "inherit"});

    const proc = Bun.spawn(["lp", "-d", "Farm_House_Xerox", "." + file]);

    // const proc = Bun.spawn(["ls", "." + file]);

    await proc.exited;

    return new Response("Done");
  },
});
