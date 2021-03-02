export class CreateUserDto {
  username: string;
  displayname: string;
  fullname?: string;
  email?: string;
  password: string;
}
