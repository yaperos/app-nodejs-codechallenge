import { Controller } from "@nestjs/common";
import OperationsService from "./operations.service";

@Controller("operations")
export default class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}
}
