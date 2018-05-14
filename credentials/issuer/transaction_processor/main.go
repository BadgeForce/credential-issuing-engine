package main

import (
	"fmt"
	"log"
	"os"

	"github.com/BadgeForce/badgeforce-chain-node/credentials/academic"
	"github.com/BadgeForce/badgeforce-chain-node/credentials/issuer"
	"github.com/rberg2/sawtooth-go-sdk/logging"
	cli "gopkg.in/urfave/cli.v1"
)

var (
	logger = logging.Get()

	Verbose int
	verbose = cli.IntFlag{
		Name:        "verbosity",
		Value:       3,
		Usage:       "Specify verbosity. 3=warn 2=debug, 1=info",
		Destination: &Verbose,
	}

	Validator string
	validator = cli.StringFlag{
		Name:        "validator, c",
		Value:       "tcp://localhost:4004",
		Usage:       "Validator component endpoint to connect to",
		Destination: &Validator,
	}

	IPFS string
	ipfs = cli.StringFlag{
		Name:        "ipfs-node, ipfs",
		Value:       "tcp://localhost:4004",
		Usage:       "IPFS component endpoint to connect to",
		Destination: &IPFS,
	}

	Queue int
	queue = cli.IntFlag{
		Name:        "max-queue-size, mqs",
		Value:       100,
		Usage:       "Set the maximum queue size before rejecting process requests",
		Destination: &Queue,
	}

	Threads int
	threads = cli.IntFlag{
		Name:        "worker-thread-count, wtc",
		Value:       0,
		Usage:       "Set the number of worker threads to use for processing requests in parallel",
		Destination: &Threads,
	}

	appFlags = []cli.Flag{verbose, validator, ipfs, queue, threads}

	startTPCommnad = cli.Command{
		Name:    "run",
		Aliases: []string{"r"},
		Usage:   "Start the transaction processor",
		Action: func(c *cli.Context) error {
			logger.SetLevel(Verbose * 10)

			academic.IPFSCONN = IPFS
			processor := issuer.NewCredentialsTP(Validator)
			err := processor.Start()
			if err != nil {
				return cli.NewExitError(fmt.Errorf("Processor stopped: %v", err), 2)
			}

			return nil
		},
		Flags: appFlags,
	}
)

func main() {
	app := cli.NewApp()
	app.Name = "badgeforce-issuer"
	app.Commands = []cli.Command{startTPCommnad}

	err := app.Run(os.Args)
	if err != nil {
		log.Fatal(err)
	}
}
