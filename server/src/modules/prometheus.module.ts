import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { Module } from "@nestjs/common";


@Module({
    imports: [
        PrometheusModule.register({
            defaultLabels: {
              app: "server",
            },
          })
    ]
})

export class PrometheusMod {}