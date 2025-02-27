# Pica

[Pica](https://www.picaos.com/) provides powerful APIs and tools to build, deploy, and scale AI agents with seamless access to over 100+ integrations

## Requirements

Set the following environment variables:

- `$PICA_SECRET_KEY` containing a [Pica secret key](https://app.picaos.com/)
- `$OPENAI_API_KEY` containing an [OpenAI API key](https://platform.openai.com/)

See https://docs.picaos.com/get-started/quickstart to get started.

## Usage

```go
package main

import (
	"context"
	"dagger/go-with-dagger/internal/dagger"
	"fmt"
)

type HelloPica struct{}

// Returns the current weather for a given location
func (m *HelloPica) CurrentWeather(ctx context.Context, location string, picaSecretKey *dagger.Secret, openaiApiKey *dagger.Secret) (string, error) {
	prompt := fmt.Sprintf("What's the weather in %s?", location)
	return dag.Pica(picaSecretKey, openaiApiKey).OneTool(ctx, prompt)
}
```

```shell
$ dagger call current-weather --location=Toronto --pica-secret-key=env://PICA_SECRET_KEY --openai-api-key=env://OPENAI_API_KEY
✔ connect 0.4s
✔ load module 1.9s
✔ parsing command line arguments 0.0s

✔ helloPica: HelloPica! 0.0s
✔ .currentWeather(
│ │ location: "Toronto"
│ │ openaiApiKey: ✔ secret(uri: "env://OPENAI_API_KEY"): Secret! 0.0s
│ │ picaSecretKey: ✔ secret(uri: "env://PICA_SECRET_KEY"): Secret! 0.0s
│ ): String! 11.4s

The current weather in Toronto is partly cloudy with a temperature of -5°C (24°F). It feels like -10°C (14°F) due to the wind. The humidity is at 53%, and the wind is coming from the northwest at 14 km/h (9 mph). Visibility is good at 14 km (8 miles), and the pressure is 1030 hPa.
```
