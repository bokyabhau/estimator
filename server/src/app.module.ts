import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { Module, DynamicModule } from '@nestjs/common';

const getImports = (): Array<any> => {
  const baseImports: any[] = [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    // Serve uploads folder
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
  ];

  if (process.env.NODE_ENV === 'production') {
    baseImports.push(
      ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..', '..', 'client', 'dist'),
        exclude: ['/api', '/uploads'],
        serveStaticOptions: {
          index: 'index.html',
        },
      }),
    );
  }

  return baseImports;
};

@Module({
  imports: getImports(),
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
