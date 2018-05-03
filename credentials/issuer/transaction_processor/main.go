package main

import (
	"fmt"
	"os"

	"github.com/BadgeForce/badgeforce-chain-node/credentials/issuer"
	"github.com/rberg2/sawtooth-go-sdk/logging"

	flags "github.com/jessevdk/go-flags"
)

type Opts struct {
	Verbose []bool `short:"v" long:"verbose" description:"Increase verbosity"`
	Connect string `short:"C" long:"connect" description:"Validator component endpoint to connect to" default:"tcp://localhost:4004"`
	Queue   uint   `long:"max-queue-size" description:"Set the maximum queue size before rejecting process requests" default:"100"`
	Threads uint   `long:"worker-thread-count" description:"Set the number of worker threads to use for processing requests in parallel" default:"0"`
}

func main() {
	var opts Opts

	logger := logging.Get()

	parser := flags.NewParser(&opts, flags.Default)
	remaining, err := parser.Parse()
	if err != nil {
		if flagsErr, ok := err.(*flags.Error); ok && flagsErr.Type == flags.ErrHelp {
			os.Exit(0)
		} else {
			logger.Errorf("Failed to parse args: %v", err)
			os.Exit(2)
		}
	}

	if len(remaining) > 0 {
		fmt.Printf("Error: Unrecognized arguments passed: %v\n", remaining)
		os.Exit(2)
	}

	validator := opts.Connect

	// switch len(opts.Verbose) {
	// case 2:
	// 	logger.SetLevel(logging.DEBUG)
	// case 1:
	// 	logger.SetLevel(logging.INFO)
	// default:
	// 	logger.SetLevel(logging.WARN)
	// }

	processor := issuer.NewCredentialsTP(validator)
	err = processor.Start()
	if err != nil {
		logger.Error("Processor stopped: ", err)
	}
}
