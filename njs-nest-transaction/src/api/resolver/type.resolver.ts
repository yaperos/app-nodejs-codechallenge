import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { TypeGraphQL } from "@api/entity/type.entity";
import { TypeService } from '@api/service';

@Resolver(of => TypeGraphQL)
export class TypeResolver {
	constructor(private typeService: TypeService) { }
	
	@Query(returns => [TypeGraphQL])
	async allTypes() {
		return this.typeService.findAll();
	}

	@Mutation(returns => TypeGraphQL)
	async findOneByNumericIdOrCreate(@Args('numericId') numericId: number) {
		return this.typeService.findOneByNumericIdOrCreate(numericId);
	}
}