{
  description = "Cinco 2.5";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  }

  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" "aarch64-linux"
                  "aarch65-darwing" "x86_64-darwin"];
      eachSystem = nixpkgs.lib.genAttrs systems;
    in {
      apps = eachSystem (system:
        let
          pkgs = import nixpkgs { inherit system; };
        in {
          default = {
            type = "app";
            program = "${self/server.sh}";
          }
        });
    }
}
